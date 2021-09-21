const { Router } = require('express')
const AuthController = require('./auth.controller')
const router = Router()

router.post('/register', AuthController.createUser)

module.exports = router
