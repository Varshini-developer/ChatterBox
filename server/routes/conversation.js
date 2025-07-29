const express = require('express');
const router = express.Router();
const { getConversations, startConversation } = require('../controllers/conversationController');
const authMiddleware = require('../middleware/authMiddleware');

// List user's conversations
router.get('/', authMiddleware, getConversations);
// Start a new 1-on-1 conversation
router.post('/', authMiddleware, startConversation);

module.exports = router; 