const { Router } = require('express')
const UserController = require('./user.controller')
const router = Router()

router.post('/login', UserController.login)
router.get('/user/:id', UserController.getUserById)
router.get('/user-username/:username', UserController.getUserByUsername)
router.post('/user-username/:id', UserController.updateUser)

module.exports = router
