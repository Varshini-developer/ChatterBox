const Conversation = require('../models/Conversation');

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ members: req.user.id })
      .populate('members', 'username avatar')
      .populate('lastMessage');
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.startConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });
    // Ensure both IDs are strings
    const id1 = req.user.id.toString();
    const id2 = userId.toString();
    // Check if conversation already exists
    let convo = await Conversation.findOne({
      isGroup: false,
      members: { $all: [id1, id2], $size: 2 },
    });
    if (convo) {
      console.log('Found existing conversation:', convo._id);
    }
    if (!convo) {
      convo = await Conversation.create({
        isGroup: false,
        members: [id1, id2],
      });
      console.log('Created new conversation:', convo._id);
    }
    convo = await convo.populate('members', 'username avatar');
    res.status(201).json(convo);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 