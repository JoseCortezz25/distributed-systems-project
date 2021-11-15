const { Schema, model } = require('mongoose')
const slug = require('slug')
const shortid = require('shortid')

const photoProfileSchema = new Schema({
  filename: {
    type: String
  },
  originalname: {
    type: String
  },
  mimetype: {
    type: String
  },
  size: {
    type: Number
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  url: {
    type: String,
    lowercase: true
  },
  imageURL: {
    type: String,
    lowercase: true
  },
  public_id: {
    type: String,
    lowercase: true
  }
})

photoProfileSchema.pre('save', function (next) {
  const url = slug(this.filename)
  this.url = `${url}-${shortid.generate()}`
  next()
})

const PhotoProfile = model('PhotoProfile', photoProfileSchema)
module.exports = PhotoProfile
