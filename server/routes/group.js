const express = require('express');
const router = express.Router();
const { createGroup, addMember, removeMember, getGroupInfo, setAdmin } = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

// Create group
router.post('/', authMiddleware, createGroup);
// Add member
router.post('/:groupId/add', authMiddleware, addMember);
// Remove member
router.post('/:groupId/remove', authMiddleware, removeMember);
// Get group info
router.get('/:groupId', authMiddleware, getGroupInfo);
// Set admin
router.post('/:groupId/admin', authMiddleware, setAdmin);

module.exports = router; 