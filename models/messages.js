const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true,
    ref: 'User'
  },
  receiver: {
    type: String,
    required: true,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('messages', messagesSchema);

module.exports = Message;
