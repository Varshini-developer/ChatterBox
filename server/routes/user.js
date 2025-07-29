const express = require('express');
const router = express.Router();
const { listUsers, searchUsers, addFriend, listFriends, removeFriend, updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// List all users (except self)
router.get('/', authMiddleware, listUsers);
// Search users by username/email
router.get('/search', authMiddleware, searchUsers);
// Add a friend
router.post('/:id/add-friend', authMiddleware, addFriend);
// List friends
router.get('/friends', authMiddleware, listFriends);
// Remove a friend
router.delete('/:id/remove-friend', authMiddleware, removeFriend);
// Update profile (avatar)
router.patch('/profile', authMiddleware, updateProfile);

module.exports = router; 