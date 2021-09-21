const { contantsView: { titlePage }, cloudinary: { cloud_name, api_key, api_secret } } = require('../config/config')
const cloudinary = require('cloudinary')
const ProjectSchema = require('../models/Project')
const PhotoSchema = require('../models/Photo')
const TITLE_PAGE = titlePage
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret
})
// const projects = require('../lib/mocks')

class ApiUserController {

  async getProjects (req, res) {
    try {
      const projects = await ProjectSchema.find().populate('image_project')
      if (!projects) {
        return res.status(404).json({
          message: 'No projects found'
        })
      }

      return res.status(200).json({
        message: 'Projects found',
        data: projects
      })
    } catch (error) {
      res.status(500).send(error)
    }
  }

  // Find project by id
  async getProjectByUrl (req, res) {
    try {
      const project = await ProjectSchema.findOne({url: req.params.url}).populate('image_project')
      if (!project) {
        return res.status(404).json({
          message: 'Project not found'
        })
      }

      return res.status(200).json({
        message: 'Project found',
        data: project
      })
    } catch (error) {
      res.status(500).send(error)
    }
  }

  // Find projects by id user
  async getProjectsUser (req, res) {
    
  }

  test(req, res) {
    try {
      console.log("TESTEANDO");
      console.log(req.body)
      console.log(req.file)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  async addProject (req, res) {
    const { filename, path, size, mimetype, originalname } = req.file
    const { name, description } = req.body

    try {
      console.group('-------> create a new project')
      console.log('INFO PRE | upload image to cloudinary')
      const result = await cloudinary.v2.uploader.upload(path)
      console.log(result)
      console.log('INFO POST | upload image to cloudinary')

      console.log('INFO 1 | create project')
      const project = new ProjectSchema({
        name,
        description
      })
      // project.technologies = technologies.split(',');
      project.technologies = ['HTML', 'CSS', 'JS']
      const newProject = await project.save();
      console.log('INFO 2 | save project')
      
      console.log('INFO 3 | create photo')
      const photo = new PhotoSchema({
        filename,
        path,
        originalname,
        mimetype,
        size,
        imageURL: result.url,
        public_id: result.public_id
      })
      
      const newPhoto = await photo.save();
      console.log('INFO 4 | save photo')
      console.log('INFO 5 | create project with photo')
      const projectWithPhoto = await ProjectSchema.findOneAndUpdate(
        { url: newProject.url }, 
        {image_project: newPhoto._id},
        { 
          new: true,
          runValidators: true
        }
      )
      console.log('INFO 6 | finilished process')
      res.redirect(`/project/${newProject.url}`)
      console.groupEnd()
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }
}

const apiUserController = new ApiUserController()
module.exports = apiUserController