const cloudinary = require('cloudinary')
const { contantsView: { titlePage }, cloudinary: { cloud_name, api_key, api_secret } } = require('../config/config')
const ProjectSchema = require('../models/Project')
const colors = require('colors')
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
      res.status(500).send(error)
    }
  }

  /* Render the view of the form to create a project */
  formAddProjectView (req, res) {
    res.render('add-project', {
      title: `Add new project | ${TITLE_PAGE}`,
    })
  }

  /* 🍎 ----  Logic ---- 🍎 */

  /* Method for creating a new project */ 
  async addProject(req, res) {
    const { filename, path, size, mimetype, originalname } = req.file
    try {
      const result = await cloudinary.v2.uploader.upload(path)
      await fs.unlink(path)
      const { name, description, technologies } = req.body
      const project = new ProjectSchema({
        name,
        description
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

      const newPhoto = await photo.save();
      await ProjectSchema.findOneAndUpdate(
        { url: newProject.url },
        { image_project: newPhoto._id },
        {
          new: true,
          runValidators: true
        }
      )
      res.redirect(`/project/${newProject.url}`)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  /* Method for updating a project by URL*/
  async updateProject(req, res) {
    let theImageExist;
    try {

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
      res.status(500).send(error)
    }
  }

  /* Method for deleting a project by ID */
  async deleteProjectByUrl(req, res) {
    try {
      console.log(colors.bgCyan(`Deleting project ${req.params.url}`))
      const project = await ProjectSchema.findOne({ url: req.params.url }).populate('image_project')
      if (!project) res.redirect('/*')
      const { image_project: { public_id }, } = project
      await cloudinary.v2.uploader.destroy(public_id)
      await PhotoSchema.findOneAndRemove({ url: image_project.url })
      await ProjectSchema.findOneAndRemove({ url: req.params.url })
      console.log(colors.bgCyan(`Project ${req.params.url} deleted :)`).black);
      res.redirect('/feed')
    } catch (error) {
      res.status(500).send(error)
    }
  }

} 

const projectController = new ProjectController()
module.exports = projectController
