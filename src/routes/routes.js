const { Router } = require('express')
const HomeController = require('../controllers/HomeController')
const UserController = require('../controllers/UserController')
const ProjectController = require('../controllers/ProjectController')
const router = Router()

// 👉 Home views
router.get('/', HomeController.initialPageView)
router.get('/feed', HomeController.feedView)
router.get('/register', HomeController.registerView)
router.get('/login', HomeController.loginView)

router.post('/register', UserController.validateRegisters, UserController.register)

// 👉 User views
router.get('/user/:name', UserController.profile)

// 👉 Project views
router.get('/project/add', ProjectController.formAddProjectView)
router.post('/project/add', ProjectController.addProject)
router.get('/project/:url', ProjectController.singleProjectView)
router.get('/project/update/:url', ProjectController.formUpdateProjectView)
router.post('/project/update/:url', ProjectController.updateProject)
// router.delete('/project/delete', UserController.addProject)

// Error View
router.get('*', function(req, res){
  res.status(404).render('page-not-found', {
    title: '404'
  });
})

module.exports = router
