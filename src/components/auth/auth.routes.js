const { Router } = require('express')
const AuthController = require('./auth.controller')
const router = Router()

router.post('/register', AuthController.createUser)
router.post('/verifyuser', AuthController.isExistsUser)
router.post('/verify-username/:username', AuthController.theUsernameExists)

module.exports = router
