const  { Schema, model } = require('mongoose')
const slug = require('slug');
const shortid = require('shortid');

const photoSchema = new Schema({
  filename: {
    type: String
  },
  path: {
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
  project_id: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
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

photoSchema.pre('save', function (next) {
  const url = slug(this.filename);
  this.url = `${url}-${shortid.generate()}`;
  next();
});

const Photo = model('Photo', photoSchema)
module.exports = Photo
