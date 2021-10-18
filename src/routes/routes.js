const { Router } = require('express')
const HomeController = require('../controllers/HomeController')
const UserController = require('../controllers/UserController')
const ProjectController = require('../controllers/ProjectController')
const AuthController = require('../controllers/AuthController')
const router = Router()

// 👉 Home views
router.get('/', HomeController.initialPageView)
router.get('/feed', AuthController.isAuthenticated, HomeController.feedView)
router.get('/register', HomeController.registerView)
router.get('/login', HomeController.loginView)
router.post('/register', UserController.validateRegisters, UserController.register)
router.post('/login', AuthController.login)

// 👉 User views
router.get('/user/:name', UserController.profile)
router.get('/user-update/:name', AuthController.isAuthenticated, UserController.userUpdateView)
router.post('/user-update/:name', AuthController.isAuthenticated, UserController.validateUpdateUser, UserController.userUpdate)

// 👉 Project views
router.get('/project/add', AuthController.isAuthenticated, ProjectController.formAddProjectView)
router.post('/project/add', AuthController.isAuthenticated, ProjectController.addProject)
router.get('/project/:url', ProjectController.singleProjectView)
router.get('/project/update/:url', AuthController.isAuthenticated, ProjectController.formUpdateProjectView)
router.post('/project/update/:url', AuthController.isAuthenticated, ProjectController.updateProject)
router.get('/project/delete/:id', AuthController.isAuthenticated, ProjectController.deleteProjectById)
// router.delete('/project/delete', UserController.addProject)

router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/')
})

// Error View
router.get('*', function(req, res){
  res.status(404).render('page-not-found', {
    title: '404',
    layout: 'SingleLayout.hbs'
  })
})

module.exports = router
