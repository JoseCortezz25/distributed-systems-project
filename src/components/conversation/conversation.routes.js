const router = require('express').Router()
const ConversationController = require('./conversation.controller')

// new conversation
router.post('/', ConversationController.createConversation)

// get conv of a user
router.get('/:userId', ConversationController.getConversation)

module.exports = router
