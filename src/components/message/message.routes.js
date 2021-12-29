const router = require('express').Router()
const MessageController = require('./message.controller')

router.post('/', MessageController.createMessage)
router.get('/:conversationId', MessageController.getMessages)

module.exports = router
