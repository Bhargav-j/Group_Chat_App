const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');
const verifyToken = require("../middleware/auth.middleware")

// Create a new message in a group
router.post('/', verifyToken, messagesController.createMessage);

// Get all messages in a group
router.get('/:id/messages', verifyToken, messagesController.getMessages);

// Get a single message by ID
// router.get('/:id', messagesController.getMessageById);

// Like/Unlike a message (optional route)
router.put('/:id/like', verifyToken, messagesController.likeMessage);

// Delete a single message by ID
router.delete('/:id', verifyToken, messagesController.deleteMessage);

// Delete multiple messages (optional route)
router.delete('/delete-multiple', messagesController.deleteMultipleMessages);

module.exports = router;
