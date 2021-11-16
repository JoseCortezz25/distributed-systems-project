const { bgGreen } = require('colors')
const mongoose = require('mongoose')
const { mongoUrl } = require('../config/config')

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(db => console.log(bgGreen('[DATABASE] DB connected').black))
  .catch(err => console.error(err))
