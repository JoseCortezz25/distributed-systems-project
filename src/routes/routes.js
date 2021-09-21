const { Router } = require('express')
const HomeController = require('../controllers/HomeController')
const UserController = require('../controllers/UserController')
const Photo = require('../models/Photo')
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
    console.log(req.file)
    console.log(req.file.filename)
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

// Routing Projects 
router.get('/project/add', UserController.formAddProject)
router.post('/project/add', UserController.addProject)
router.get('/project/:url', UserController.singleProject)
router.get('/project/update/:url', UserController.formUpdateProject)
router.post('/project/update/:url', UserController.updateProject)
// router.delete('/project/delete', UserController.addProject)


// one user

// one user's projects

// Routing General
router.get('*', function(req, res){
  res.status(404).render('page-not-found', {
    title: '404'
  });
})

module.exports = router
