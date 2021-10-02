const passport = require('passport')
const mongoose = require('mongoose')
require('../lib/database')

class AuthController {
  async login (req, res) {
    passport.authenticate('local', {
      successRedirect: '/feed',
      failureRedirect: '/login',
      failureFlash: true,
      badRequestMessage: 'Please enter a username and password'
    })(req, res)
  }

  async logout (req, res) {
    req.logout()
    res.redirect('/')
  }

  // async register (req, res) {
  //   const { username, password } = req.body
  //   const user = new mongoose.models.User({ username, password })
  //   await user.save()
  //   res.redirect('/login')
  // }
}

const authController = new AuthController()
module.exports = authController
