const { Schema, model } = require('mongoose')
const slug = require('slug')
const shortid = require('shortid')

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  technologies: [String],
  created_at: {
    type: Date,
    default: Date.now()
  },
  url: {
    type: String,
    lowercase: true
  },
  image_project: {
    type: Schema.Types.ObjectId,
    ref: 'Photo'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

projectSchema.pre('save', function (next) {
  const url = slug(this.name)
  this.url = `${url}-${shortid.generate()}`
  next()
})

const Project = model('Project', projectSchema)
module.exports = Project
