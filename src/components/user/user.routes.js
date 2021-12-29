const { Router } = require('express')
const UserController = require('./user.controller')
const router = Router()

router.post('/login', UserController.login)
router.get('/user/:id', UserController.getUserById)
router.get('/user-username/:username', UserController.getUserByUsername)
router.post('/user-username/:id', UserController.updateUser)
router.post('/follow-user/:id_sender/:id_receiver', UserController.followUser)
router.post('/verify-user-to-follow/:username_sender/:id_receiver', UserController.verifyFollowUser)
router.get('/user-following/:username', UserController.getUserFollowing)
router.get('/users-friend/', UserController.getUsersFriend)

module.exports = router
