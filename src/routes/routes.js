const { Router } = require('express')
const HomeController = require('../controllers/HomeController')
const UserController = require('../controllers/UserController')
const ProjectController = require('../controllers/ProjectController')
const AuthController = require('../controllers/AuthController')
const passport = require('passport');
const router = Router()

// 👉 Home views
router.get('/', HomeController.initialPageView)
router.get('/feed', isAuthenticated, HomeController.feedView)
router.get('/register', HomeController.registerView)
router.get('/login', HomeController.loginView)
router.post('/register', UserController.validateRegisters, UserController.register)
router.post('/login', AuthController.login)

// 👉 User views
router.get('/user/:name', UserController.profile)
router.get('/user-update/:name', UserController.userUpdateView)
router.post('/user-update/:name', UserController.userUpdate)

// 👉 Project views
router.get('/project/add', ProjectController.formAddProjectView)
router.post('/project/add', ProjectController.addProject)
router.get('/project/:url', ProjectController.singleProjectView)
router.get('/project/update/:url', ProjectController.formUpdateProjectView)
router.post('/project/update/:url', ProjectController.updateProject)
router.get('/project/delete/:url', ProjectController.deleteProjectByUrl)
// router.delete('/project/delete', UserController.addProject)

// Error View
router.get('*', function(req, res){
  res.status(404).render('page-not-found', {
    title: '404',
    layout: 'SingleLayout.hbs'
  });
})

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}

module.exports = router
