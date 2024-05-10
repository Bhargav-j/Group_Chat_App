const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verifyToken = require("../middleware/auth.middleware")

// Register a user
router.post('/register', authController.register);

// Login a user
router.post('/login', authController.login);

// Fetch userData based on AccessToken
router.get('/fetchUser', verifyToken, authController.fetchUser);

module.exports = router;
