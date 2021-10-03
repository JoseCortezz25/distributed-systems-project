const cloudinary = require('cloudinary')
const { contantsView: { titlePage }, cloudinary: { cloud_name, api_key, api_secret } } = require('../config/config')
const ProjectSchema = require('../models/Project')
const colors = require('colors')
const PhotoSchema = require('../models/Photo')
const UserSchema  = require('../models/User')
const response = require('../lib/response')
const fs = require('fs-extra')
const TITLE_PAGE = titlePage
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret
})

class UserController {

  /* 🍔 ---- Views ---- 🍔 */
  async profile(req, res) {
    try {
      const { name } = req.params
      const user = await UserSchema.findOne({ username: name })
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
  
  /* 🍎 ----  Logic ---- 🍎 */

  async register(req, res) {
    const errors = req.validationErrors()
    if (!errors) {
      try {
        const theUserExist = await UserSchema.findOne({ username: req.body.username })
        if (!theUserExist) req.flash('error', 'Username already exist')

        const user = new UserSchema(req.body)
        const newUser = await user.save()

        req.flash('correcto', 'You have successfully registered')
        res.redirect('/login')
      } catch (error) {
        console.log(error)
        req.flash('error', error)
        res.redirect('/register')
      }
    }
  }

  async userUpdateView(req, res) {
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

  async userUpdate(req, res) {
    try {
      const { name } = req.params
      console.log('username', name);
      const theUserExist = await UserSchema.findOne({ username: name })
      if (!theUserExist) res.redirect('/*')      
      req.body.username = name
      // if (req.file) {
      //   console.log(colors.bgCyan.black('Uploading image...'))
      //   const { filename, path, size, mimetype, originalname } = req.file
      //   const result = await cloudinary.v2.uploader.upload(path)
      //   await fs.unlink(path)
      //   const profilePicture = await PhotoSchema.findOneAndUpdate({
      //     _id: theUserExist.profile_image_id
      //   },
      //   {
      //     filename,
      //     originalname,
      //     mimetype,
      //     size,
      //     imageURL: result.url,
      //     public_id: result.public_id
      //   },
      //   {
      //     new: true,
      //     runValidators: true
      //   })
      //   req.body.profile_image_id = profilePicture._id
      //   await UserSchema.findOneAndUpdate(
      //     {
      //       username: req.params.name
      //     },
      //     req.body,
      //     {
      //       new: true,
      //       runValidators: true
      //     }
      //     )
      //     return res.redirect(`/user/${theUserExist.username}`)
      //   } 
        
      // if(!req.file){
        console.log(req.body);
        // console.log(colors.bgCyan.black('There isnt image...'))
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
      // }

    } catch (error) {
      console.log(error)
      req.flash('error', error)
      res.redirect('/*')
    }
  }

  validateRegisters(req, res, next) {
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
}

const userController = new UserController()
module.exports = userController
