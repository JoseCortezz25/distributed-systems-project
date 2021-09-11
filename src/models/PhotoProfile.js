const  { Schema, model } = require('mongoose')
const slug = require('slug');
const shortid = require('shortid');

const photoProfileSchema = new Schema({
  title: { type: String },
  description: { type: String },
  filename: { type: String },
  path: { type: String },
  originalname: { type: String },
  mimetype: { type: String },
  size: { type: Number },
  created_at: { type: Date, default: Date.now() },
  imageURL: String,
  public_id: String,
  user: {
    type: Schema.Types.ObjectId,
    red: 'User'
  }
})

photoProfileSchema.pre('save', function (next) {
  const url = slug(this.title);
  this.url = `${url}-${shortid.generate()}`;
  next();
});

const PhotoProfile = model('PhotoProfile', photoProfileSchema)
module.exports = PhotoProfile
