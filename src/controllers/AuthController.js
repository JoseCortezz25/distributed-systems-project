const passport = require('passport')
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

  logout (req, res) {
    req.logout(logout)
    res.flash('correcto', 'You have logged out')
    res.redirect('/')
  }

  isAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }
}

const authController = new AuthController()
module.exports = authController
