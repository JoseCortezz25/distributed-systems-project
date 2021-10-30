const { Router } = require('express')
const ProjectController = require('./project.controller')
const router = Router()

router.get('/projects', ProjectController.getProjects)
router.get('/project/:url', ProjectController.getProjectByUrl)
router.post('/add-project/', ProjectController.createNewProject)
router.post('/update-project/:url', ProjectController.updateProject)
// router.post('/delete-project/:id', ProjectController.deleteProject)
router.delete('/delete-project/:id', ProjectController.deleteProject)

module.exports = router
