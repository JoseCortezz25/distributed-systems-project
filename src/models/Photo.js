const  { Schema, model } = require('mongoose')
const slug = require('slug');
const shortid = require('shortid');

const photoSchema = new Schema({
  title: { type: String },
  description: { type: String },
  filename: { type: String },
  path: { type: String },
  originalname: { type: String },
  mimetype: { type: String },
  size: { type: Number },
  created_at: { type: Date, default: Date.now() },
  imageURL: String,
  public_id: String
})

photoProfileSchema.pre('save', function (next) {
  const url = slug(this.title);
  this.url = `${url}-${shortid.generate()}`;
  next();
});

const Photo = model('Photo', photoSchema)
module.exports = Photo
