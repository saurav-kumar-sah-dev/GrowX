import mongoose from 'mongoose';

const aiChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userEmail: {
    type: String,
    default: null
  },
  userName: {
    type: String,
    default: null
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  sessionId: {
    type: String,
    default: () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  topic: {
    type: String,
    default: 'general'
  },
  isGuest: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

aiChatSchema.index({ userId: 1, createdAt: -1 });
aiChatSchema.index({ sessionId: 1 });

const AIChat = mongoose.model('AIChat', aiChatSchema);

export default AIChat;
