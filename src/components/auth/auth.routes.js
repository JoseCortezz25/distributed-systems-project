const { Router } = require('express')
const AuthController = require('./auth.controller')
const router = Router()

router.post('/register', AuthController.createUser)
router.post('/verifyuser', AuthController.isExistsUser)
// router.post('/login', AuthController.loginUser)

module.exports = router
