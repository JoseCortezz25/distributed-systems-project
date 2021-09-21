const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  profession: {
    type: String,
    required: true,
    trim: true
  },
  // skills: [String],
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'PhotoProfile'
  },
  token: String,
  expiration: Date
})


userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
  }catch(err) {
    next(err)
  }
})

const User = model('User', userSchema)
module.exports = User
