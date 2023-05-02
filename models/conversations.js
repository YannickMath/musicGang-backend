const mongoose = require('mongoose');


const conversationsSchema = new mongoose.Schema({
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }]
  });

  const Conversation = mongoose.model('conversations', conversationsSchema);
module.exports = Conversation;