const bcrypt = require('bcrypt')
const UserSchema = require('../../models/User')
const response = require('../../lib/response')
const auth = require('./auth.index')
const rug = require('random-username-generator')

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
      rug.setSeperator('_')
      req.body.username = rug.generate()
      const user = new UserSchema(req.body)
      const newUser = await user.save()

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
}

const authController = new AuthController()
module.exports = authController
