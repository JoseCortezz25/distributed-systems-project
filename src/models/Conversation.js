const mongoose = require('mongoose')

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array
    }
  },
  { timestamp: true }
)

module.exports = mongoose.model('Conversation', ConversationSchema)
