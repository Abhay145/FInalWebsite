// src/routes/studentRoutes.js
const express = require('express');
const rateLimit = require('express-rate-limit');

const { registerStudent, loginStudent, getStudentProfile, updateStudentProfile,ChooseElective,getStudentDetails,clearelectives,ChooseElective2 } = require('../controllers/studentController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');

const router = express.Router();
const electiveLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 10, // limit each IP/token to 3 requests
  message: {
    message: 'Too many submissions. Please wait 3 minutes and try again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', registerStudent);
router.post('/login', electiveLimiter,loginStudent);
router.get('/profile', authMiddleware, getStudentProfile);
router.get('/details', authMiddleware, getStudentDetails);
router.put('/profile', authMiddleware, updateStudentProfile);
router.post('/OpenElective', authMiddleware,electiveLimiter,ChooseElective);
router.post('/OpenElective2', authMiddleware,ChooseElective2);
router.delete('/OpenElective', authMiddleware,clearelectives);


module.exports = router;
