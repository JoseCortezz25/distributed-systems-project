const Message = require('../../models/Message')
const response = require('../../lib/response')
const colors = require('colors')

class MessageController {
  async createMessage (req, res) {
    try {
      const newMessage = new Message(req.body)
      const savedMessage = await newMessage.save()
      response.success(req, res, savedMessage, 201)
    } catch (error) {
      response.error(req, res, error, 500)
    }
  }

  async getMessages (req, res) {
    console.log(colors.bgMagenta('get messages'))
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId
      })
      console.log(colors.magenta(messages))
      response.success(req, res, messages, 200)
    } catch (error) {
      response.error(req, res, error, 500)
    }
  }
}

const messageController = new MessageController()
module.exports = messageController
