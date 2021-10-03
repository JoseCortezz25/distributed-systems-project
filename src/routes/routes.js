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
router.get('/user-update/:name', isAuthenticated, UserController.userUpdateView)
router.post('/user-update/:name', isAuthenticated, UserController.userUpdate)

// 👉 Project views
router.get('/project/add', isAuthenticated, ProjectController.formAddProjectView)
router.post('/project/add', isAuthenticated, ProjectController.addProject)
router.get('/project/:url', ProjectController.singleProjectView)
router.get('/project/update/:url', isAuthenticated, ProjectController.formUpdateProjectView)
router.post('/project/update/:url', isAuthenticated, ProjectController.updateProject)
router.get('/project/delete/:url', isAuthenticated, ProjectController.deleteProjectByUrl)
// router.delete('/project/delete', UserController.addProject)

router.get('/logout', (req, res, next) => {
  console.log(res.locals.user);
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

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

module.exports = router
