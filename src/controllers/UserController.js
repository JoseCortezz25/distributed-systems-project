/* eslint-disable no-extra-boolean-cast */
const cloudinary = require('cloudinary')
// eslint-disable-next-line camelcase
const { contantsView: { titlePage }, cloudinary: { cloud_name, api_key, api_secret } } = require('../config/config')
const ProjectSchema = require('../models/Project')
const colors = require('colors')
const PhotoSchema = require('../models/Photo')
const PhotoProfileSchema = require('../models/PhotoProfile')
const UserSchema = require('../models/User')
const fs = require('fs-extra')
const TITLE_PAGE = titlePage
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret
})

class UserController {
  /* 🍔 ---- Views ---- 🍔 */
  async profile (req, res) {
    try {
      const { name } = req.params
      const user = await UserSchema.findOne({ username: name }).populate('profile_image')
      const projects = await ProjectSchema.find({ user: user._id }).populate('image_project')
      res.render('profile', {
        title: `${name} | ${TITLE_PAGE}`,
        user,
        projects
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  async userUpdateView (req, res) {
    try {
      const { name } = req.params
      const user = await UserSchema.findOne({ username: name })
      res.render('update-user', {
        title: `Updating ${user.username} | ${TITLE_PAGE}`,
        user
      })
    } catch (error) {
      res.redirect('/*')
    }
  }

  /* 🍎 ----  Logic ---- 🍎 */

  async register (req, res) {
    const errors = req.validationErrors()
    if (!errors) {
      try {
        console.log(colors.bgGreen('---> Registering...   ------------').black)
        const theUserExist = await UserSchema.findOne({ email: req.body.email })

        if (Boolean(theUserExist)) {
          req.flash('error', 'The user already exist')
          res.redirect('/register')
        }

        const user = new UserSchema(req.body)
        await user.save()

        req.flash('correcto', 'You have successfully registered')
        res.redirect('/login')
      } catch (error) {
        console.log(colors.red(error))
        req.flash('error', error)
        res.redirect('/register')
      }
    }
  }

  async userUpdate (req, res) {
    try {
      const { name } = req.params
      const theUserExist = await UserSchema.findOne({ username: name })
      if (!theUserExist) res.redirect('/*')
      req.body.username = name

      if (req.file) {
        const { filename, path, size, mimetype, originalname } = req.file
        const resultImageUpload = await cloudinary.v2.uploader.upload(path)
        await fs.unlink(path)
        const profilePicture = await PhotoProfileSchema.create({
          filename,
          originalname,
          mimetype,
          size,
          imageURL: resultImageUpload.url,
          public_id: resultImageUpload.public_id
        })
        req.body.profile_image = profilePicture._id
      }
      await UserSchema.findOneAndUpdate(
        {
          username: name
        },
        req.body,
        {
          new: true,
          runValidators: true
        }
      )
      return res.redirect(`/user/${theUserExist.username}`)
    } catch (error) {
      console.log(error)
      req.flash('error', error)
      res.redirect('/*')
    }
  }

  async uploadImage (image) {
    if (!image) return false
    try {
      console.log(colors.bgCyan.black('Uploading image...'))
      const { filename, path, size, mimetype, originalname } = image
      const resultImageUpload = await cloudinary.v2.uploader.upload(path)
      await fs.unlink(path)
      const profilePicture = await PhotoSchema.create({
        filename,
        originalname,
        mimetype,
        size,
        imageURL: resultImageUpload.url,
        public_id: resultImageUpload.public_id
      })
      return profilePicture
    } catch (error) {
      console.log(error)
      return false
    }
  }

  validateRegisters (req, res, next) {
    // sanitizer
    req.sanitizeBody('fullname').escape()
    // req.sanitizeBody('username').escape()
    req.sanitizeBody('email').escape()
    req.sanitizeBody('password').escape()
    req.sanitizeBody('confirmpassword').escape()
    req.sanitizeBody('description').escape()
    req.sanitizeBody('profession').escape()

    // Validate
    req.checkBody('fullname', 'Fullname is required').notEmpty()
    // req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('email', 'Email is not valid').isEmail()
    req.checkBody('email', 'Email is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('confirmpassword', 'Confirm password is required').notEmpty()
    req.checkBody('confirmpassword', 'Confirm password and password are different').equals(req.body.password)
    req.checkBody('description', 'Description is required').notEmpty()
    req.checkBody('profession', 'Profession is required').notEmpty()

    const errors = req.validationErrors()
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

  async validateUpdateUser (req, res, next) {
    // sanitizer
    req.sanitizeBody('fullname').escape()
    req.sanitizeBody('email').escape()
    req.sanitizeBody('description').escape()
    req.sanitizeBody('profession').escape()

    // Validate
    req.checkBody('fullname', 'Fullname is required').notEmpty()
    req.checkBody('email', 'Email is not valid').isEmail()
    req.checkBody('email', 'Email is required').notEmpty()
    req.checkBody('description', 'Description is required').notEmpty()
    req.checkBody('profession', 'Profession is required').notEmpty()

    const errors = req.validationErrors()
    if (errors) {
      req.flash('error', errors.map(err => err.msg))
      const { name } = req.params
      const user = await UserSchema.findOne({ username: name })
      res.render('update-user', {
        title: `Updating ${user.username} | ${TITLE_PAGE}`,
        layout: 'SingleLayout.hbs',
        user,
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
