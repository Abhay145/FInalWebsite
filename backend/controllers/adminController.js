const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.js');
const Student = require('../models/Student.js');
const Professor = require('../models/Professor.js');
const Subject = require('../models/Subject');
const mongoose = require('mongoose');
const fs = require('fs')
const axios = require('axios');  
const { chunk } = require("lodash");


// Make sure you have bcryptjs installed

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({
      name,
      email: email.toLowerCase(), // Lowercase to avoid case-sensitivity issues
      password: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error during admin registration:', error); // Log the error for debugging
    res.status(500).json({ message: 'Something went wrong' });
  }
};


exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() }); // Make email lowercase to match registration
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Compare the password with the stored hash
    const isPasswordCorrect =  bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a token
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during admin login:', error); // Log error for debugging
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getAllProfessors = async (req, res) => {
  try {
    const professors = await Professor.find().select('-password');
    res.status(200).json(professors);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getstudents = async (req, res) => {
  const { studentIds } = req.body; // Extract the array of student IDs
  try {
    
    // Use Mongoose `find` to fetch students with IDs in the array
    const students = await Student.find({ _id: { $in: studentIds } });
    res.json(students); // Send the matching students back to the frontend
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Error fetching students');
  }
};





  
exports.assignBasedOnChoices = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch all subjects to avoid multiple round trips to the DB
    const subjects = await Subject.find({}).lean();
    const subjectMap = new Map(subjects.map(subject => [subject._id.toString(), subject]));

    // Fetch students with filled choices, sorted by CG
    const students = await Student.find({
      choices: { $exists: true, $not: { $size: 0 } }, // Filter for students with non-empty choices
      sem: 6, // Ensure the semester is 6
    })
      .sort({ CG: -1, Time: 1 }) // Sort by CG (descending) and Time (ascending)
      .populate('choices'); // Populating choices once

    const studentUpdates = [];
    const subjectUpdates = [];

    // Iterate through students and their choices
    for (const student of students) {
      for (const elective of student.choices) {
        const subject = subjectMap.get(elective._id.toString());

        if (!subject || subject.seats <= 0) {
          // If subject not found or no seats available, continue to next choice
          continue;
        }

        // Atomically decrement the seat count and assign the student to the subject
        const updatedSubject = await Subject.findOneAndUpdate(
          { _id: elective._id, seats: { $gt: 0 } }, // Ensure seats are available
          { $inc: { seats: -1 }, $push: { students: student._id } },
          { session, new: true } // new: true to get the updated subject document
        );

        if (!updatedSubject) {
          // If subject update fails (e.g., seat count was changed), move to the next choice
          continue;
        }

        // Prepare student update
        studentUpdates.push({
          updateOne: {
            filter: { _id: student._id },
            update: { $set: { subjects: elective._id } },
          },
        });

        break; // Stop after assigning one subject to this student
      }
    }

    // Perform bulk writes for students and subjects
    if (studentUpdates.length > 0) {
      await Student.bulkWrite(studentUpdates, { session });
    }

    // Commit the transaction if everything is successful
    await session.commitTransaction();
    res.status(200).json({ message: 'Electives assigned and seats updated successfully.' });
  } catch (error) {
    // If there's an error, abort the transaction
    console.error('Error assigning electives:', error);
    await session.abortTransaction();
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  } finally {
    // End the session
    session.endSession();
  }
};


exports.assignFallbackElectives = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch all subjects to avoid multiple round trips to the DB
    const subjects = await Subject.find({}).lean();
    const subjectMap = new Map(subjects.map(subject => [subject._id.toString(), subject]));

    // Fetch students with filled choices, sorted by CG
    const students = await Student.find({
      choices: { $exists: true, $not: { $size: 0 } }, // Filter for students with non-empty choices
      sem: 8, // Ensure the semester is 6
    })
      .sort({ CG: -1, Time: 1 }) // Sort by CG (descending) and Time (ascending)
      .populate('choices'); // Populating choices once

    const studentUpdates = [];
    const subjectUpdates = [];

    // Iterate through students and their choices
    for (const student of students) {
      for (const elective of student.choices) {
        const subject = subjectMap.get(elective._id.toString());

        if (!subject || subject.seats <= 0) {
          // If subject not found or no seats available, continue to next choice
          continue;
        }

        // Atomically decrement the seat count and assign the student to the subject
        const updatedSubject = await Subject.findOneAndUpdate(
          { _id: elective._id, seats: { $gt: 0 } }, // Ensure seats are available
          { $inc: { seats: -1 }, $push: { students: student._id } },
          { session, new: true } // new: true to get the updated subject document
        );

        if (!updatedSubject) {
          // If subject update fails (e.g., seat count was changed), move to the next choice
          continue;
        }

        // Prepare student update
        studentUpdates.push({
          updateOne: {
            filter: { _id: student._id },
            update: { $set: { subjects: elective._id } },
          },
        });

        break; // Stop after assigning one subject to this student
      }
    }

    // Perform bulk writes for students and subjects
    if (studentUpdates.length > 0) {
      await Student.bulkWrite(studentUpdates, { session });
    }

    // Commit the transaction if everything is successful
    await session.commitTransaction();
    res.status(200).json({ message: 'Electives assigned and seats updated successfully.' });
  } catch (error) {
    // If there's an error, abort the transaction
    console.error('Error assigning electives:', error);
    await session.abortTransaction();
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  } finally {
    // End the session
    session.endSession();
  }
};
    

    







exports.clearSubjectsForAllStudents = async (req, res) => {
  try {
    // Fetch all subjects, ensuring it returns the documents with the appropriate ObjectId
    const subjects = await Subject.find().lean();

    // Prepare bulk write operations for subjects
    const subjectUpdates = subjects.map((subject) => ({
      updateOne: {
        filter: { _id: subject._id },
        update: {
          $set: {
            seats: subject.defaultSeats, // Reset seats to the default value
            students: [], // Clear students array
          },
        },
      },
    }));

    // Execute bulk write for subjects
    if (subjectUpdates.length > 0) {
      await Subject.bulkWrite(subjectUpdates);
    }

    // Update all students: clear the `subject` field and add the `Time` field with the current time
    await Student.updateMany({}, {
      $set: {
        subjects: null,
       
      },
    });

    res.status(200).json({
      message: 'Subjects cleared for all students, Time field added, and seats reset successfully.',
    });
  } catch (error) {
    console.error('Error clearing subjects and resetting seats:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};