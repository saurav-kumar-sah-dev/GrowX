import AIChat from '../models/aiChat.model.js';
import { User } from '../models/user.model.js';

export const createChat = async (req, res) => {
  try {
    const { messages, topic, sessionId, userName } = req.body;
    const userId = req.id || null;
    let userEmail = null;
    let savedUserName = userName || null;
    
    if (userId) {
      const user = await User.findById(userId).select('fullname email');
      if (user) {
        userEmail = user.email;
        savedUserName = user.fullname || userName;
      }
    }
    
    const isGuest = !userId;

    const chat = new AIChat({
      userId,
      userEmail,
      userName: savedUserName,
      messages,
      topic: topic || 'general',
      sessionId: sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isGuest
    });

    await chat.save();
    res.status(201).json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.topic) filter.topic = req.query.topic;

    const [chats, total] = await Promise.all([
      AIChat.find(filter)
        .populate('userId', 'fullname email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AIChat.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: chats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChatById = async (req, res) => {
  try {
    const chat = await AIChat.findById(req.params.id)
      .populate('userId', 'fullname email');

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const userId = req.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [chats, total] = await Promise.all([
      AIChat.find({ userId })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      AIChat.countDocuments({ userId })
    ]);

    res.status(200).json({
      success: true,
      data: chats,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateChat = async (req, res) => {
  try {
    const { messages, topic } = req.body;
    const chat = await AIChat.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { messages: { $each: messages } },
        ...(topic && { topic })
      },
      { new: true, runValidators: true }
    );

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const chat = await AIChat.findByIdAndDelete(req.params.id);

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    res.status(200).json({ success: true, message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChatStats = async (req, res) => {
  try {
    const [totalChats, guestChats, userChats, topicStats] = await Promise.all([
      AIChat.countDocuments(),
      AIChat.countDocuments({ isGuest: true }),
      AIChat.countDocuments({ isGuest: false }),
      AIChat.aggregate([
        { $group: { _id: '$topic', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalChats,
        guestChats,
        userChats,
        topicStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecentChats = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const chats = await AIChat.find()
      .populate('userId', 'fullname email')
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select('sessionId topic messages userEmail isGuest createdAt updatedAt');

    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
