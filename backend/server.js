// app.js (server.js)
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const studentRoutes = require('./routes/studentRoutes.js');
const professorRoutes = require('./routes/professorRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const subjectsRoute = require('./routes/subjects.js');
const Subject = require('../backend/models/Subject.js');
const Student = require('../backend/models/Student.js');
const { authMiddleware } = require('../backend/middleware/authMiddleware.js');

dotenv.config();

const app = express();

// Configure CORS
app.use( cors());

// Middleware for parsing JSON and larger payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/eligible-subjects', subjectsRoute);

app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find().populate({
      path: 'students', // Field in Subject schema that references Student
      select: 'name rollNumber choices dept CG', // Select specific fields from Student
      populate: { path: 'choices', select: 'name code' } // If choices in students reference subjects, populate them too
    });
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Error fetching subjects' });
  }
});
const otpStore = {}; 



app.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
        otpStore[email] = otp; // Store OTP temporarily
        console.log(otp);

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use TLS
            auth: {
                user: 'medichain824@gmail.com',
                pass: 'arhx lmmh hphs uqti',
            },
        });

        await transporter.sendMail({
            from: '"NIT KKR" <medichain824@gmail.com>',
            to: email,
            subject: "OTP Received",
            text: `Your OTP is: ${otp}. Enter this OTP to verify your email address.`,
        });

        res.status(200).json({ success: true, message: "OTP sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error.message);
        res.status(500).json({ success: false, message: "Failed to send OTP.", error: error.message });
    }
});




// Fetch the selected electives for a student
app.get('/api/student/selected-electives', authMiddleware, async (req, res) => {
  try {
    const studentId = req.userId;
    const student = await Student.findById(studentId).populate('choices');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ selectedElectives: student.choices });
  } catch (error) {
    console.error('Error fetching selected electives:', error);
    res.status(500).json({ message: 'Error fetching selected electives' });
  }
});

// Update electives chosen by the student
app.post('/api/student/update-electives', authMiddleware, async (req, res) => {
  try {
    const { selectedElectives } = req.body;
    const studentId = req.userId;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Replace old choices with new ones
    student.choices = selectedElectives;
    await student.save();

    res.json({ message: 'Electives updated successfully' });
  } catch (error) {
    console.error('Error updating electives:', error);
    res.status(500).json({ message: 'Error updating electives' });
  }
});

// Other routes
app.use('/api/student', studentRoutes);
app.use('/api/professor', professorRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all error handling middleware
app.use((err, req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// Server timeout to handle large requests
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.timeout = 120000; // 2 minutes timeout
