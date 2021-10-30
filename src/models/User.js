const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')
const rug = require('random-username-generator')

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    lowercase: true
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
  profile_image: {
    type: Schema.Types.ObjectId,
    ref: 'PhotoProfile'
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }],
  token: String,
  expiration: Date
})

// Encrypt password
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
  } catch (err) {
    next(err)
  }
})

// Generate random username
userSchema.pre('save', function (next) {
  try {
    rug.setSeperator('_')
    this.username = rug.generate()
    next()
  } catch (err) {
    next(err)
  }
})

userSchema.post('save', function (err, doc, next) {
  if (err.name === 'MongoServerError' && err.code === 11000) {
    next('Username or email already exists')
  } else {
    next(err)
  }
})

// Comparate password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (err) {
    throw new Error(err)
  }
}

const User = model('User', userSchema)
module.exports = User
