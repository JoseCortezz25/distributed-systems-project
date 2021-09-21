const express = require('express')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')
const exphbs = require('express-handlebars')
const colors = require('colors')
const config = require('./config/config')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const { mongoUrl } = require('./config/config')
const errors = require('./lib/errors');

const app = express()

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
app.use(morgan('dev'))

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/uploads'),
  filename: (req, file, cb) => {
    console.group("UPLOAD IMAGE NOW")
    console.log(file)
    console.groupEnd()
    cb(null, new Date().getTime() + path.extname(file.originalname))
  }
})
app.use(multer({ storage }).single('image'))

//session
app.use(session({
  secret: config.secret,
  key: config.key,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUrl,
  })
}));

// static files
app.use(express.static(path.join(__dirname, 'public')))

// Routing
app.use('/api', require('./components/project/project.routes'))
app.use('/api', require('./components/auth/auth.routes'))
// app.use('/api', require('./components/user/user.routes'))
// app.use('/api', require('./routes/api.routes'))
app.use(require('./routes/routes'))

require('./lib/database')

// Middleware responsible for errors 
app.use(errors);

// Start
app.listen(config.port, () => {
  console.clear()
  console.log(colors.bgGreen(`👉 [ INFO API ] Listening at the port http://localhost:${config.port}/ in mode ${process.env.NODE_ENV}`).black)
})
