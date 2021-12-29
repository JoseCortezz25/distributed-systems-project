const { Router } = require('express')
const ProjectController = require('./project.controller')
const router = Router()

router.get('/projects', ProjectController.getProjects)
router.get('/project/:url', ProjectController.getProjectByUrl)
router.get('/project-id/:id', ProjectController.getProjectById)
router.post('/add-project/', ProjectController.createNewProject)
router.post('/update-project/:url', ProjectController.updateProject)
// router.post('/delete-project/:id', ProjectController.deleteProject)
router.get('/projects-following/:id', ProjectController.getProjectsFollowingByUser)

module.exports = router
