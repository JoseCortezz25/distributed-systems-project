const { Schema, model } = require('mongoose')
const slug = require('slug');
const shortid = require('shortid');

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
  // user: {
  //   type: Schema.Types.ObjectId,
  //   red: 'User'
  // },
  // image_project: {
  //   type: Schema.Types.ObjectId,
  //   red: 'Photo'
  // }
})

projectSchema.pre('save', function (next) {
  const url = slug(this.name);
  this.url = `${url}-${shortid.generate()}`;
  next();
});

const Project = model('Project', projectSchema)
module.exports = Project
