const Conversation = require('../models/Conversation');
const User = require('../models/User');

exports.createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    if (!name || !members || !Array.isArray(members) || members.length < 2) {
      return res.status(400).json({ message: 'Group name and at least 2 members required' });
    }
    const group = await Conversation.create({
      name,
      isGroup: true,
      members: [...members, req.user.id],
      admins: [req.user.id],
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const group = await Conversation.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } },
      { new: true }
    );
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const group = await Conversation.findByIdAndUpdate(
      groupId,
      { $pull: { members: userId } },
      { new: true }
    );
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getGroupInfo = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Conversation.findById(groupId).populate('members', 'username avatar').populate('admins', 'username avatar');
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.setAdmin = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const group = await Conversation.findByIdAndUpdate(
      groupId,
      { $addToSet: { admins: userId } },
      { new: true }
    );
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 