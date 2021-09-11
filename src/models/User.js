const { Schema, model } = require('mongoose')
const slug = require('slug');
const shortid = require('shortid');

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
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
  skills: [String],
  profile: {
    type: Schema.Types.ObjectId,
    red: 'PhotoProfile'
  }
})

userSchema.pre('save', function (next) {
  const url = slug(this.username);
  this.url = `${url}-${shortid.generate()}`;
  next();
});

const User = model('User', userSchema)
module.exports = User
