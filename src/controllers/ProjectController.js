const cloudinary = require('cloudinary')
// eslint-disable-next-line camelcase
const { contantsView: { titlePage }, cloudinary: { cloud_name, api_key, api_secret } } = require('../config/config')
const ProjectSchema = require('../models/Project')
// const colors = require('colors')
const PhotoSchema = require('../models/Photo')
const User = require('../models/User')
const fs = require('fs-extra')
const TITLE_PAGE = titlePage
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret
})

class ProjectController {
  /* 🍔 ---- Views ---- 🍔 */

  /* Render single project view */
  async singleProjectView (req, res) {
    try {
      const project = await ProjectSchema.findOne({ url: req.params.url }).populate('user')
      if (!project) res.redirect('/*')
      const photo = await PhotoSchema.findOne({ _id: project.image_project })

      const userIdFromProject = project.user._id
      const user = await User.findOne({ _id: userIdFromProject }).populate('profile_image')
      console.log(user)
      res.render('single-project', {
        title: `${project.name} | ${TITLE_PAGE}`,
        project,
        photo,
        owner: user
      })
    } catch (error) {
      console.log(error)
      res.redirect('/*')
    }
  }

  /* Render form update view */
  async formUpdateProjectView (req, res) {
    try {
      const project = await ProjectSchema.findOne({ url: req.params.url })
      if (!project) res.redirect('/*')
      res.render('update-project', {
        title: `Update project | ${TITLE_PAGE}`,
        project
      })
    } catch (error) {
      console.log(error)
      res.redirect('/*')
    }
  }

  /* Render the view of the form to create a project */
  formAddProjectView (req, res) {
    res.render('add-project', {
      title: `Add new project | ${TITLE_PAGE}`
    })
  }

  /* 🍎 ----  Logic ---- 🍎 */

  /* Method for creating a new project */
  async addProject (req, res) {
    const { filename, path, size, mimetype, originalname } = req.file
    try {
      const result = await cloudinary.v2.uploader.upload(path)
      await fs.unlink(path)
      const { name, description, technologies } = req.body
      const project = new ProjectSchema({
        name,
        description,
        user: res.locals.currentUser._id
      })
      project.technologies = technologies.split(',')
      const newProject = await project.save()
      const photo = new PhotoSchema({
        filename,
        originalname,
        mimetype,
        size,
        imageURL: result.url,
        public_id: result.public_id
      })

      const newPhoto = await photo.save()
      const newProjectWithPhoto = await ProjectSchema.findOneAndUpdate(
        { url: newProject.url },
        { image_project: newPhoto._id },
        {
          new: true,
          runValidators: true
        }
      )
      const user = await User.findOne({ _id: res.locals.currentUser._id })
      user.projects = user.projects.concat(newProjectWithPhoto)
      await user.save()
      res.redirect(`/project/${newProject.url}`)
    } catch (error) {
      res.redirect('/*')
    }
  }

  /* Method for updating a project by URL */
  async updateProject (req, res) {
    let theImageExist
    try {
      // eslint-disable-next-line no-unneeded-ternary
      theImageExist = !req.file ? false : true
      const theProjectExist = await ProjectSchema.findOne({ url: req.params.url }).populate('image_project')
      if (!theProjectExist) res.redirect('/*')
      const projectToUpdate = req.body
      projectToUpdate.technologies = req.body.technologies.split(',')
      if (theImageExist) {
        const { filename, path, size, mimetype, originalname } = req.file
        const result = await cloudinary.v2.uploader.upload(path)
        await fs.unlink(path)
        const updatedImage = await PhotoSchema.findOneAndUpdate({
          _id: theProjectExist.image_project
        },
        {
          filename,
          originalname,
          mimetype,
          size,
          imageURL: result.url,
          public_id: result.public_id
        },
        {
          new: true,
          runValidators: true
        }
        )
        projectToUpdate.image_project = updatedImage._id
        const project = await ProjectSchema.findOneAndUpdate(
          {
            url: req.params.url
          },
          projectToUpdate,
          {
            new: true,
            runValidators: true
          }
        )
        return res.redirect(`/project/${project.url}`)
      } else {
        const photoFinded = await PhotoSchema.findOne({ _id: theProjectExist.image_project })
        projectToUpdate.image_project = photoFinded._id
        const project = await ProjectSchema.findOneAndUpdate(
          {
            url: req.params.url
          },
          projectToUpdate,
          {
            new: true,
            runValidators: true
          }
        )
        return res.redirect(`/project/${project.url}`)
      }
    } catch (error) {
      console.log(error)
      res.redirect('/*')
    }
  }

  /* Method for deleting a project by ID */
  async deleteProjectById (req, res) {
    try {
      const project = await ProjectSchema.findOne({ _id: req.params.id }).populate('image_project')
      const idPhoto = project.image_project._id
      const idPublicPhoto = project.image_project.public_id
      await cloudinary.v2.uploader.destroy(idPublicPhoto)
      await PhotoSchema.findOneAndRemove({ _id: idPhoto })
      await ProjectSchema.findOneAndRemove({ _id: req.params.id })
      res.redirect('/feed')
    } catch (error) {
      res.redirect('/*')
    }
  }

  validateAddProject (req, res, next) {
    // sanitizer
    req.sanitizeBody('name').escape()
    req.sanitizeBody('technologies').escape()
    req.checkBody('name', 'name is required').notEmpty()
    req.checkBody('technologies', 'technologies is required').notEmpty()

    const errors = req.validationErrors()
    if (errors) {
      req.flash('error', errors.map(err => err.msg))
      res.render('add-project', {
        title: `Add new project | ${TITLE_PAGE}`,
        messages: req.flash()
      })
      return
    }
    next()
  }
}

const projectController = new ProjectController()
module.exports = projectController
