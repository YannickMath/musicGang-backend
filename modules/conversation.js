const Conversation = require("../models/conversations");
const User = require('../models/users');

//fonction pour créer une conversation à 2 ou ajouter de nouveau msg à une conversation existanteconst User = require('../models/users');

async function createConversationIfNotExists(message) {
    const sender = message.sender;
    const receiver = message.receiver;
    
    // Rechercher les utilisateurs par leur uniqueId
    const senderUser = await User.findOne({ uniqueId: sender });
    const receiverUser = await User.findOne({ uniqueId: receiver });
  
    if (!senderUser || !receiverUser) {
      throw new Error('Invalid sender or receiver');
    }
  
    const senderId = senderUser._id;
    const receiverId = receiverUser._id;
  
    Conversation.findOne({
      $and: [
        { participants: senderId },
        { participants: receiverId },
      ],
    })
      .then(existingConversation => {
        if (!existingConversation) {
          const newConversation = new Conversation({
            participants: [senderId, receiverId],
            messages: [message._id],
          });
          return newConversation.save();
        } else {
          existingConversation.messages.push(message._id);
          return existingConversation.save();
        }
      })
      .catch(error => {
        console.error('Error creating conversation:', error);
      });
  }
  
  module.exports.createConversationIfNotExists = createConversationIfNotExists;
  