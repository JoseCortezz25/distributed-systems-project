const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const moongose = require('mongoose')
const User = moongose.model('User')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email })
    if (!user) return done(null, false, { message: 'User does not exit' })
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) return done(null, false, { message: 'Incorrect password' })
    return done(null, user)
  } catch (error) {
    done(error)
  }
}))

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser( async (id, done) => {
  const user = await User.findById(id)
  return done(null, user)
})

