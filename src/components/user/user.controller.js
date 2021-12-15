const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../../config/config')
const UserSchema = require('../../models/User')
const ProjectSchema = require('../../models/Project')
const PhotoProfileSchema = require('../../models/PhotoProfile')
const response = require('../../lib/response')
const colors = require('colors')
const fs = require('fs-extra')
const cloudinary = require('cloudinary')
const { cloudinary: { cloud_name, api_key, api_secret } } = require('../../config/config')
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret
})

class UserController {
  async getUserById (req, res) {
    try {
      const { id } = req.params
      const user = await UserSchema.findById(id).populate('profile_image')
      const projects = await ProjectSchema.find({ user: id }).populate('image_project')
      if (!user) return response.error(req, res, 'User not found', 404)
      user.password = undefined
      user.projects = projects
      response.success(req, res, user, 200)
    } catch (error) {
      response.error(req, res, error.message, 500)
    }
  }

  async getUserByUsername (req, res) {
    try {
      console.log(colors.bgBlue('Get user by username'))
      const { username } = req.params
      const user = await UserSchema.findOne({ username }).populate('profile_image')
      // if (user === null) return response.error(req, res, 'User not found', 404)
      if (!user) return response.error(req, res, 'User not found', 404)
      const projects = await ProjectSchema.find({ user: user._id }).populate('image_project')
      user.password = undefined
      user.projects = projects
      console.log(user)
      response.success(req, res, user, 200)
    } catch (error) {
      response.error(req, res, error.message, 500)
    }
  }

  async login (req, res) {
    try {
      console.log(colors.bgBlue('Login'))
      const { email, password } = req.body
      const user = await UserSchema.findOne({ email })

      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.password)
      if (!(user && passwordCorrect)) return response.error(req, res, 'Password incorrect or user was not found', 401)

      const userForToken = {
        id: user._id,
        username: user.username,
        name: user.name
      }

      const token = jwt.sign(userForToken, config.key_secret)

      console.log({
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        token
      })
      response.success(req, res, {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        token
      }, 201)
    } catch (error) {
      response.error(req, res, error, 401)
    }
  }

  async updateUser (req, res) {
    try {
      const { id } = req.params
      const theUserExist = await UserSchema.findOne({ _id: id })
      if (!theUserExist) return response.error(req, res, 'User not found', 404)
      // userUpdated = req.body

      req.body.fullname = req.body.fullname === '' ? theUserExist.fullname : req.body.fullname
      req.body.profession = req.body.profession === '' ? theUserExist.profession : req.body.profession
      req.body.email = req.body.email === '' ? theUserExist.email : req.body.email
      req.body.description = req.body.description === '' ? theUserExist.description : req.body.description

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

      const newUser = await UserSchema.findOneAndUpdate(
        {
          _id: theUserExist._id
        },
        req.body,
        {
          new: true,
          runValidators: true
        }
      )
      return response.success(req, res, newUser, 200)
    } catch (error) {
      console.log(error)
      response.error(req, res, error.message, 500)
    }
  }

  async followUser (req, res) {
    try {
      const { id_sender: idSender, id_receiver: idReceiver } = req.params
      const userSender = await UserSchema.findById(idSender)
      const userToFollow = await UserSchema.findById(idReceiver)
      const userFollowed = userSender.following.find(user => user.toString() === idReceiver)

      if (!userFollowed) {
        userSender.following = userSender.following.concat(idReceiver)
        userToFollow.followers = userToFollow.followers.concat(idSender)
        await userSender.save()
        await userToFollow.save()
        return response.success(req, res, userSender, 200)
      } else {
        userSender.following = userSender.following.filter(user => user.toString() !== idReceiver)
        userToFollow.followers = userToFollow.followers.filter(user => user.toString() !== idSender)
        await userSender.save()
        await userToFollow.save()
        return response.success(req, res, userSender, 200)
      }
    } catch (error) {
      response.error(req, res, error, 500)
    }
  }

  async verifyFollowUser (req, res) {
    try {
      const { id_sender: idSender, id_receiver: idReceiver } = req.params
      const userSender = await UserSchema.findById(idSender)
      const userFollowed = userSender.following.find(user => user.toString() === idReceiver)

      userFollowed ? response.success(req, res, true, 200) : response.error(req, res, false, 400)
    } catch (error) {
      response.error(req, res, error, 500)
    }
  }

  async getUserFollowing (req, res) {
    try {
      console.log(colors.bgBlue('Get user following'))
      const user = await UserSchema.findOne({ username: req.params.username }).populate('following')
      const userWithFollowers = await UserSchema.findOne({ username: req.params.username }).populate('followers')
      const userWithImage = await UserSchema.findOne({ username: req.params.username }).populate('profile_image')
      user.followers = userWithFollowers.followers
      user.profile_image = userWithImage.profile_image
      if (!user) return response.error(req, res, 'User not found', 404)
      console.log(user)
      response.success(req, res, user, 200)
    } catch (error) {
      response.error(req, res, error, 500)
    }
  }
}

const userController = new UserController()
module.exports = userController
