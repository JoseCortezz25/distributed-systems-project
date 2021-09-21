if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const config = {
  port: process.env.PORT || 5000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbPort: process.env.DB_PORT,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  secret: process.env.SECRET,
  key: process.env.KEY,
  mongoUrl: `mongodb+srv://${encodeURIComponent(process.env.DB_USER)}:${encodeURIComponent(process.env.DB_PASSWORD)}@clusterdistributedsyste.unokf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,

  contantsView: {
    titleProject: 'Mi Folio',
    titlePage: 'MiFolio'
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }
}

module.exports = config
