const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const colors = require('colors')
const config = require('./config/config')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const { mongoUrl } = require('./config/config')
const errors = require('./lib/errors')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const passport = require('passport')
const { Server } = require('socket.io')
const { upload } = require('./config/multer')

const app = express()

// Socket io
const server = require('http').Server(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

let users = []

const addUser = (userId, socketId, username) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId, username })
}

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
  return users.find((user) => user.userId === userId)
}

io.on('connection', (socket) => {
  // when ceonnect
  console.log('a user connected.')
  console.log(colors.bgYellow('users online').black)
  console.log(colors.yellow(users))
  // take userId and socketId from user
  socket.on('addUser', (userId, username) => {
    addUser(userId, socket.id, username)
    io.emit('getUsers', users)
  })

  // send and get message
  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    // console.log(colors.blue({
    //   receiverId,
    //   senderId,
    //   text
    // }))
    const user = getUser(receiverId)
    const user2 = getUser(senderId)
    console.log(colors.green(`Sedding message from ${user2.username} to ${user.username}`))
    io.to(user.socketId).emit('getMessage', {
      senderId,
      text
    })
  })

  // when disconnect
  socket.on('disconnect', () => {
    console.log('a user disconnected!')
    removeUser(socket.id)
    io.emit('getUsers', users)
  })
})

// CORS
app.use(cors())

// Settings
app.set('port', config.port)
app.set('views', path.join(path.join(__dirname, 'views')))

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./helpers/handlebars'),
  handlebars: allowInsecurePrototypeAccess(require('handlebars'))
}))
app.set('view engine', '.hbs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(upload)
app.use(expressValidator())

// session
app.use(session({
  secret: config.secret,
  key: config.key,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUrl
  })
}))

// Use passport
app.use(passport.initialize())
app.use(passport.session())

// Settings and connect flash
app.use(flash())

app.use((req, res, next) => {
  res.locals.messages = req.flash()
  res.locals.currentUser = req.user || null
  next()
})

// static files
app.use(express.static(path.join(__dirname, 'public')))

// Routing
app.use('/api', require('./components/user/user.routes'))
app.use('/api', require('./components/project/project.routes'))
app.use('/api', require('./components/auth/auth.routes'))
app.use('/api/conversations', require('./components/conversation/conversation.routes'))
app.use('/api/messages', require('./components/message/message.routes'))
// app.use('/api', require('./components/message/message.routes'))
app.use(require('./routes/routes'))

require('./lib/database')
require('./lib/passport')

// Middleware responsible for errors
app.use(errors)

server.listen(config.portSocket, function () {
  console.log(colors.bgBlue(`👉 [ INFO SOCKET ] Listening at the port http://localhost:${config.portSocket}/`).black)
})

// Start
app.listen(config.port, () => {
  console.clear()
  console.log(colors.bgGreen(`👉 [ INFO API ] Listening at the port http://localhost:${config.port}/`).black)
})
