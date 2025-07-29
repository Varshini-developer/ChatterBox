const User = require('../models/User');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('username email avatar');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      _id: { $ne: req.user.id },
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
    }).select('username email avatar');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.friends.includes(req.params.id)) {
      user.friends.push(req.params.id);
      await user.save();
    }
    res.json({ message: 'Friend added' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.listFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'username email avatar');
    // Filter out self from friends
    const friends = user.friends.filter(f => f._id.toString() !== req.user.id.toString());
    res.json(friends);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.friends = user.friends.filter(fid => fid.toString() !== req.params.id);
    await user.save();
    res.json({ message: 'Friend removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (req.body.avatar) user.avatar = req.body.avatar;
    await user.save();
    const updated = await User.findById(req.user.id).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 