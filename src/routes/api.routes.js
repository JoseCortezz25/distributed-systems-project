const { Router } = require('express')
const ApiController = require('../controllers/ApiController')
const router = Router()

router.get('/projects', ApiController.getProjects)
router.get('/project/:url', ApiController.getProjectByUrl)
router.post('/add-project/', ApiController.addProject)
router.post('/test', ApiController.test)

module.exports = router
