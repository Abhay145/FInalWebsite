const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student.js');
const Subject = require('../models/Subject.js');

// Register student with hashed password (using async/await)
exports.registerStudent = async (req, res) => {
  try {
    const { rollNumber, password } = req.body;
    const student = await Student.findOne({ rollNumber });

    console.log('Searching for rollNumber:', rollNumber, 'of type:', typeof rollNumber);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (password) {
      // Hash the password using async/await instead of callbacks
     
      student.password = password;

      try {
        await student.save(); // Save the updated student document
        return res.status(200).json({ message: 'Password updated successfully' });
      } catch (saveErr) {
        console.error('Error saving student:', saveErr);
        return res.status(500).json({ message: 'Error saving student' });
      }
    } else {
      // Return student details (without password) for pre-filling
      const { name, email, branch, sem } = student;
      res.status(200).json({ name, email, branch, sem });
    }
  } catch (error) {
    console.error('Error handling student registration:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


exports.loginStudent = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const { password } = req.body;

    console.log("Login attempt for email:", email);

    const student = await Student.findOne({ email });

    if (!student) {
      console.log("Student not found with email:", email);
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log("Stored  password:", student.password);

    const isPasswordCorrect = await bcryptjs.compare(password, student.password);
    console.log("Password comparison result:", isPasswordCorrect);

    
    

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};



// exports.loginStudent = async (req, res) => {
//   try {
//     // Ensure the email is lowercase to avoid case sensitivity issues
//     const email = req.body.email.toLowerCase();
//     const { password } = req.body;
//     console.log(password);

//     console.log("Login attempt for email:", email);

//     const student = await Student.findOne({ email });
   
//     if (!student) {
//       console.log("Student not found with email:", email);
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     // Log hashed password for debugging
//     console.log("Stored hashed password:", student.password);
    
//     // Compare the entered password with the hashed password
//     const isPasswordCorrect = await bcryptjs.compare(password, student.password);
//     console.log("Password comparison result:", isPasswordCorrect);

//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

    
//     const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(200).json({ token });
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// };


exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.userId).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.updateStudentProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.userId,
      { name, email },
      { new: true }
    ).select('-password');

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};


exports.getEligibleSubjects = async (req, res) => {
  try {
    // Fetch student details by ID
    const student = await Student.findById(req.userId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find eligible subjects based on department and semester
    const eligibleSubjects = await Subject.find({
      eligibility: student.dept,
      sem: student.sem, // Match semester as well
    });

    res.status(200).json({
      message: 'Eligible subjects fetched successfully',
      electives: eligibleSubjects,
    });
  } catch (error) {
    console.error('Error fetching eligible subjects:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Save selected electives for the student
exports.ChooseElective = async (req, res) => {
  try {
    const { selectedElectives } = req.body;

    // Validate selected electives by checking if all IDs exist in the Subject collection
    const validSubjects = await Subject.find({ _id: { $in: selectedElectives } });
    if (validSubjects.length !== selectedElectives.length) {
      return res.status(400).json({ message: 'One or more electives are invalid' });
    }

    // Get the current timestamp
    const currentTime = new Date().toISOString();

    // Update the student's choices field with the validated electives and set the current time
    const updatedStudent = await Student.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          choices: selectedElectives, // Update choices
          Time: currentTime,          // Update time field
        },
      },
      { new: true }
    ).populate('choices'); // Populate to return full elective details in the response

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Electives chosen successfully',
      choices: updatedStudent.choices,
      time: updatedStudent.time, // Include time in the response
    });
  } catch (error) {
    console.error('Error choosing electives:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
exports.ChooseElective2 = async (req, res) => {
  try {
    const { selectedElectives } = req.body;

    // Validate selected electives by checking if all IDs exist in the Subject collection
    const validSubjects = await Subject.find({ _id: { $in: selectedElectives } });
    if (validSubjects.length !== selectedElectives.length) {
      return res.status(400).json({ message: 'One or more electives are invalid' });
    }

    // Get the current timestamp
    const currentTime = new Date().toISOString();

    // Update the student's choices field with the validated electives and set the current time
    const updatedStudent = await Student.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          choices2: selectedElectives, // Update choices
          Time: currentTime,          // Update time field
        },
      },
      { new: true }
    ).populate('choices'); // Populate to return full elective details in the response

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Electives chosen successfully',
      choices: updatedStudent.choices,
      time: updatedStudent.time, // Include time in the response
    });
  } catch (error) {
    console.error('Error choosing electives:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getStudentDetails = async (req, res) => {
  try {
      const student = await Student.findById(req.userId)
          .populate("subjects", "name code") // Populate the subjects field with specific fields
          .select("-password"); // Exclude password

      if (!student) {
          return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json({ student });
  } catch (error) {
      console.error("Error fetching student details:", error);
      res.status(500).json({ message: "Failed to fetch student details" });
  }
};
exports.clearelectives = async (req, res) => {
  try {
    // Use `req.user.id` (assuming authMiddleware attaches the user ID)
    const updatedStudent = await Student.findByIdAndUpdate(
      req.userId, // Corrected from req.userId
      { $set: { choices: [] } }, // Clear the choices array
      { new: true } // Return the updated document
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.status(200).json({ message: 'Choices cleared successfully.' });
  } catch (error) {
    console.error("Error clearing choices:", error); // Log the error
    res.status(500).json({ message: 'Failed to clear choices.', error });
  }
};


