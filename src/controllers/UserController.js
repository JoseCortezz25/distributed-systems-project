const cloudinary = require('cloudinary')
const { contantsView: { titlePage }, cloudinary: { cloud_name, api_key, api_secret } } = require('../config/config')
const ProjectSchema = require('../models/Project')
const colors = require('colors')
const PhotoSchema = require('../models/Photo')
const User = require('../models/User')
const response = require('../lib/response')
const fs = require('fs-extra')
const TITLE_PAGE = titlePage
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret
})

class UserController {
  async profile(req, res) {
    try {
      const { name } = req.params

      const user = await User.findOne({ username: name })

      res.render('profile', {
        title: `${name} | ${TITLE_PAGE}`,
        user
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  async register(req, res) {
    try {
      const {
        username,
      } = req.body

      const theUserExist = await UserSchema.findOne({ username: username })
      if (theUserExist) {
        return res.status(404).send('username already exist')
      }

      const user = new UserSchema(req.body)
      const newUser = await user.save()
      res.render('home', {
        title: `${username}'s home' | ${TITLE_PAGE}`,
        user: newUser
      })
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }

  validateRegisters(req, res) {
    // sanitizer
    req.sanitizeBody('fullname').escape()
    req.sanitizeBody('username').escape()
    req.sanitizeBody('email').escape()
    req.sanitizeBody('password').escape()
    req.sanitizeBody('confirmpassword').escape()
    req.sanitizeBody('description').escape()
    req.sanitizeBody('profession').escape()

    // Validate
    req.checkBody('fullname', 'Fullname is required').notEmpty()
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('email', 'Email is not valid').isEmail()
    req.checkBody('email', 'Email is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('confirmpassword', 'Confirm password is required').notEmpty()
    req.checkBody('confirmpassword', 'Confirm password and password are different').equals(req.body.password)
    req.checkBody('description', 'Description is required').notEmpty()
    req.checkBody('profession', 'Profession is required').notEmpty()

    const errors = req.validationErrors()
    // console.log(errors)
    if (errors) {
      req.flash('error', errors.map(err => err.msg))
      res.render('register', {
        title: 'Register | ' + TITLE_PAGE,
        layout: 'SingleLayout.hbs',
        body: req.body,
        messages: req.flash()
      })
      return
    }
    next()
  }
}

const userController = new UserController()
module.exports = userController
