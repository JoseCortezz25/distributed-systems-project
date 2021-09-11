const { Router } = require('express')
const HomeController = require('../controllers/HomeController')
const UserController = require('../controllers/UserController')
const router = Router()

// router.get('/', (req, res) => {
//     res.render('images', {
//         title: 'Images',
//     })
// })

router.get('/images/add', (req, res) => {
  res.render('image_form', {
    title: 'Add Imagen'
  })
})

router.post('/images/add', (req, res) => {
  try {
    console.group('Petición')
    console.log(req.body)
    // console.log(req.file)
    console.groupEnd()
    res.send('received')
  } catch (error) {
    console.log(error)
  }
})

// Routing Home

router.get('/', HomeController.home)
router.get('/home', HomeController.homeUser)

// Creating and login User
router.get('/login', UserController.loginView)
router.get('/register', UserController.registerView)
router.get('/user/:name', UserController.profile)

// Routing User
router.get('/project/add', UserController.formAddProject)
router.post('/project/add', UserController.addProject)
// router.post('/project/update', UserController.addProject)
// router.delete('/project/delete', UserController.addProject)

// one user

// one user's projects

// Routing General

module.exports = router
