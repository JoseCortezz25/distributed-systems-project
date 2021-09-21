const cloudinary = require('cloudinary')
const { contantsView: { titlePage }, cloudinary: { cloud_name, api_key, api_secret } } = require('../config/config')
const ProjectSchema = require('../models/Project')
const PhotoSchema = require('../models/Photo')
const User = require('../models/User')
const TITLE_PAGE = titlePage
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret
})

class UserController {
  login(req, res) {
    res.send('login')
  }

  register(req, res) {
    res.send('register')
  }

  loginView(req, res) {
    res.render('login', {
      title: `Login | ${TITLE_PAGE}`
    })
  }

  registerView(req, res) {
    res.render('register', {
      title: `Register | ${TITLE_PAGE}`
    })
  }

  formAddProject(req, res) {
    res.render('add-project', {
      title: `Add new project | ${TITLE_PAGE}`
    })
  }

  async addProject(req, res) {
    const { filename, path, size, mimetype, originalname } = req.file
    try {
      console.group('-------> create a new project')
      console.log('INFO PRE | upload image to cloudinary')
      const result = await cloudinary.v2.uploader.upload(path)
      console.log(result)
      console.log('INFO POST | upload image to cloudinary')

      const { name, description, technologies } = req.body;
      console.log('INFO 1 | create project')
      const project = new ProjectSchema({
        name,
        description
      })
      project.technologies = technologies.split(',');
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
        // project_id: newProject._id
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

  async formUpdateProject (req, res) {
    try {
      const project = await ProjectSchema.findOne({ url: req.params.url })
      if (!project) res.redirect('/*')
      res.render('update-project', {
        title: `Update project | ${TITLE_PAGE}`,
        project
      })
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }

  async updateProject (req, res) {
    try {
      const updatedProject = req.body;
      updatedProject.technologies = updatedProject.technologies.split(',');
      const project = await ProjectSchema.findOneAndUpdate(
        { 
          url: req.params.url 
        }, 
          updatedProject,
        { 
          new: true,
          runValidators: true
        }
      )

      res.redirect(`/project/${project.url}`)
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }

  async singleProject(req, res) {
    try {
      const project = await ProjectSchema.findOne({ url: req.params.url })
      if (!project) res.redirect('/*')
      const photo = await PhotoSchema.findOne({ _id: project.image_project })
      res.render('single-project', {
        title: `${project.name} | ${TITLE_PAGE}`,
        project,
        photo
      })
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }


  async profile(req, res) {
    try {
      const { name } = req.params

      const user = await User.findOne({ username: name })

      res.render('profile', {
        title: `${name} | ${TITLE_PAGE}`,
        user
      })
    } catch (error) {
      throw new Error(error)
    }
  }
}

const userController = new UserController()
module.exports = userController
