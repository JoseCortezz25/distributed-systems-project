const { bgGreen } = require('colors')
const mongoose = require('mongoose')
const { mongoUrl } = require('../config/config')
// const User = require('../models/User')

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(db => console.log(bgGreen('[DATABASE] DB connected').black))
  .catch(err => console.error(err))

// const userTest = new User({
//   fullname: 'John Doe',
//   username: 'johndoe',
//   password: '123456',
//   description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//   profession: 'Software Engineer',
//   skills: [
//     'HTML',
//     'CSS',
//     'JavaScript',
//     'Node.js',
//     'React.js',
//     'MongoDB',
//     'Express.js',
//     'Mongoose.js'
//   ]
// })

// userTest.save()
//   .then(result => {
//     console.log(result)
//     mongoose.connection.close()
//   })
//   .catch(err => console.error(err))

// User.findOne({ username: 'johndoe' })
//   .then(result => {
//     console.log(result)
//   })
//   .catch(err => console.error(err))
