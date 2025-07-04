// src/routes/studentRoutes.js
const express = require('express');
const { registerStudent, loginStudent, getStudentProfile, updateStudentProfile,ChooseElective,getStudentDetails,clearelectives,ChooseElective2 } = require('../controllers/studentController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/profile', authMiddleware, getStudentProfile);
router.get('/details', authMiddleware, getStudentDetails);
router.put('/profile', authMiddleware, updateStudentProfile);
router.post('/OpenElective', authMiddleware,ChooseElective);
router.post('/OpenElective2', authMiddleware,ChooseElective2);
router.delete('/OpenElective', authMiddleware,clearelectives);


module.exports = router;
