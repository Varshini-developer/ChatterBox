const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Register
router.post('/register', registerUser);
// Login
router.post('/login', loginUser);
// Get profile (protected)
router.get('/profile', authMiddleware, getProfile);

module.exports = router; 