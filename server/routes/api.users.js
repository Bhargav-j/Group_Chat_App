const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware")
const userController = require('../controllers/user.controller'); // Relative path

// Create a new user
// router.post('/', userController.createUser);

// Get all users
router.get('/', verifyToken, userController.getUsers);

// Get a single user by ID
router.get('/:id', verifyToken, userController.getUserById);

// Update a user by ID
router.put('/update-user', verifyToken, userController.updateUser);

// Exit the group
router.put('/:id/exit-group', verifyToken, userController.removeUserFromGroup);

// Delete a user by ID
router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;
