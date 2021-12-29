const Conversation = require('../../models/Conversation')
const response = require('../../lib/response')
const colors = require('colors')

class ConversationController {
  async createConversation (req, res) {
    console.log(`conversation  ${req.body.senderId} ${req.body.receiverId}`)
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId]
    })

    try {
      const savedConversation = await newConversation.save()
      response.success(req, res, savedConversation, 201)
    } catch (error) {
      response.error(req, res, error, 500)
    }
  }

  async getConversation (req, res) {
    try {
      console.log(colors.bgYellow('get conversation'))
      const conversation = await Conversation.find({
        members: { $in: [req.params.userId] }
      })
      response.success(req, res, conversation, 200)
    } catch (error) {
      response.error(req, res, error, 500)
    }
  }
}

const conversationController = new ConversationController()
module.exports = conversationController
