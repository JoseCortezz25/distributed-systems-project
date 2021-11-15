const multer = require('multer')
const path = require('path')

const multerStorage = multer.diskStorage({
  destination: path.join(__dirname, '../public/uploads'),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: multerStorage
}).single('image')

module.exports = { upload }
