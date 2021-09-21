const { Router } = require('express')
const ProjectController = require('./project.controller')
const router = Router()

router.get('/projects', ProjectController.getProjects)
router.get('/project/:url', ProjectController.getProjectByUrl)
router.post('/add-project/', ProjectController.addProject)

module.exports = router
