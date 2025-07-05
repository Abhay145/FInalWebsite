// src/routes/adminRoutes.js
const express = require('express');
const { registerAdmin, loginAdmin, getAllStudents, getAllProfessors, assignBasedOnChoices,assignFallbackElectives,clearSubjectsForAllStudents, getstudents,checkAdminRole} = require('../controllers/adminController.js');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login',loginAdmin);
router.get('/students', authMiddleware, adminMiddleware, getAllStudents);
router.get('/professors', authMiddleware, adminMiddleware, getAllProfessors);
router.post('/chosen-electives', authMiddleware, adminMiddleware,assignBasedOnChoices );
router.post('/nonchosen-electives', authMiddleware, adminMiddleware,assignFallbackElectives );
router.get('/check-admin', checkAdminRole);

router.post('/substudents', getstudents );
router.delete('/electives',clearSubjectsForAllStudents );

module.exports = router;
