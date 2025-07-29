const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, searchMessages } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Send a message
router.post('/', authMiddleware, sendMessage);
// Get messages for a conversation (with pagination)
router.get('/:conversationId', authMiddleware, getMessages);
// Search messages in a conversation
router.get('/:conversationId/search', authMiddleware, searchMessages);

module.exports = router; 