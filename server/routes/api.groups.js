const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups.controller');
const verifyToken = require("../middleware/auth.middleware")

// Create a new group
router.post('/', verifyToken, groupsController.createGroup);

// Get all groups
router.get('/', verifyToken, groupsController.getGroups);

// Get a single group by ID
router.get('/:id/info', verifyToken, groupsController.getGroupById);

// Update a group by ID
router.put('/:id', verifyToken, groupsController.updateGroup);

// Delete a group by ID
router.delete('/:id', verifyToken, groupsController.deleteGroup);

// Add a user to a group
router.put('/:id/add-user', verifyToken, groupsController.addUserToGroup);

// Remove a user from a group
router.put('/:id/remove-members', verifyToken, groupsController.removeUserFromGroup);

module.exports = router;
