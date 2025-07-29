const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content, type, fileUrl } = req.body;
    const message = await Message.create({
      sender: req.user.id,
      content,
      type: type || 'text',
      fileUrl,
      conversation: conversationId,
    });
    // Update last message in conversation
    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('sender', 'username avatar');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.searchMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { q } = req.query;
    const messages = await Message.find({
      conversation: conversationId,
      content: { $regex: q, $options: 'i' },
    }).populate('sender', 'username avatar');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 