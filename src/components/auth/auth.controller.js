const bcrypt = require('bcrypt')
const UserSchema = require('../../models/User')
const response = require('../../lib/response')
// const helpers = require('../../helpers/helpers')
const colors = require('colors')
const auth = require('./auth.index')
class AuthController {
  async isExistsUser (req, res) {
    const { email } = req.body
    const theUserExist = await UserSchema.findOne({ email })
    if (theUserExist) {
      return res.json({
        message: 'User already exist'
      })
    } else {
      return res.json({
        message: 'User don\'t exist'
      })
    }
  }

  // Create a new user
  async createUser (req, res) {
    try {
      console.log(colors.bgBlue('Create user').black)
      console.log(req.body)

      const user = new UserSchema(req.body)
      const newUser = await user.save()
      console.log(colors.bgGreen.black(newUser))
      newUser.password = undefined
      response.success(req, res, newUser, 200)
    } catch (error) {
      response.error(req, res, error, 500)
    }
  }

  // Login a user
  async loginUser (req, res) {
    try {
      const { email, password } = req.body

      // if (!helpers.isEmail(email)) {
      //   return response.error(req, res, 'Email is invalid', 400)
      // }

      const user = await UserSchema.findOne({ email: email })
      if (!user) {
        return response.error(req, res, 'User not found', 404)
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return response.error(req, res, 'Password is not valid', 400)
      }

      const token = await auth.sign({ ...user })
      response.success(req, res, token, 200)
    } catch (error) {
      console.log(error)
      response.error(req, res, error, 500)
    }
  }

  validateRegisters (req, res) {
    // sanitizer
    req.sanitizeBody('fullname').escape()
    req.sanitizeBody('username').escape()
    req.Body('email').escape()
    req.sanitizeBody('confirmpassword').escape()
    req.sanitizeBody('description').escape()
    req.sanitizeBody('profession').escape()
    req.checkBody('fullname', 'Fullname is required').notEmpty()
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('email', 'Email is required').notEmpty()
    req.checkBody('email', 'Email is not valid').isEmail()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('confirmpassword', 'Confirm password is required').notEmpty()
    req.checkBody('confirmpassword', 'Confirm password and password are different').equals(req.body.password)
    req.checkBody('description', 'Description is required').notEmpty()
    req.checkBody('profession', 'Profession is required').notEmpty()

    const errors = req.validationErrors()
    console.log(errors)
    // eslint-disable-next-line no-useless-return
    return
  }
}

const authController = new AuthController()
module.exports = authController
