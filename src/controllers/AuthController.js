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

  isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }
}

const authController = new AuthController()
module.exports = authController
