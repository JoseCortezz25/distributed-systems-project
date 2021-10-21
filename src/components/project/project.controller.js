const cloudinary = require('cloudinary')
const ProjectSchema = require('../../models/Project')
const PhotoSchema = require('../../models/Photo')
const UserSchema = require('../../models/User')
const response = require('../../lib/response')
const colors = require('colors')
const jwt = require('jsonwebtoken')
const fs = require('fs-extra')
const {
  contantsView: {
    titlePage
  },
  cloudinary: {
    cloud_name,
    api_key,
    api_secret
  },
  key_secret
} = require('../../config/config')
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret
})

istheUserAuthorized = (authorization) => {
  try {
    
    let token = null
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      token = authorization.substring(7)
    }
    const decodedToken = jwt.verify(token, key_secret)
    
    if (!token || !decodedToken.id) return false
    return decodedToken
  } catch (error) {
    return false
  }
}
class ProjectController {
  async getProjects(req, res) {
    try {
      const projects = await ProjectSchema.find().populate('image_project').populate('user')
      console.log(projects);
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

  async getProjectByUrl(req, res) {
    try {
      const project = await ProjectSchema.findOne({ url: req.params.url }).populate('image_project')
      const user = await UserSchema.findOne({ _id: project.user }).populate('profile_image')
      if (!project) return response.error(req, res, 'Project not found', 404)
      project.user = user
      return response.success(req, res, project, 200)
    } catch (error) {
      response.error(req, res, error, 500)
    }
  }

  async addProject(req, res, next) {
    const authorization = req.get('authorization')
    const userAuthorized = istheUserAuthorized(authorization)
    if (userAuthorized) {
      const user = await UserSchema.findOne({ _id: userAuthorized.id })
      const result = await cloudinary.v2.uploader.upload(path)
      await fs.unlink(path)
      const { name, description, technologies } = req.body
      const project = new ProjectSchema({
        name,
        description,
        user: user._id
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
      const newProjectWithPhoto = await ProjectSchema.findOneAndUpdate(
        { url: newProject.url },
        { image_project: newPhoto._id },
        {
          new: true,
          runValidators: true
        }
      )
      user.projects = user.projects.concat(newProjectWithPhoto)
      await user.save()
      response.success(req, res, newProjectWithPhoto, 201)
    } else {
      return response.error(req, res, 'Unauthorized', 401)
    }

    if (userAuthorized) {

      // try {
      //   const { filename, path, size, mimetype, originalname } = req.file
      //   const { name, description, technologies } = req.body

      //   const result = await cloudinary.v2.uploader.upload(path)
      //   const project = new ProjectSchema({ name, description })

      //   project.technologies = technologies.split(',');
      //   const newProject = await project.save();
      //   const photo = new PhotoSchema({ filename, originalname, mimetype, size, imageURL: result.url, public_id: result.public_id })
      //   const newPhoto = await photo.save()

      //   await ProjectSchema.findOneAndUpdate({ url: newProject.url }, { image_project: newPhoto._id }, { new: true, runValidators: true })
      //   const projectFull = await ProjectSchema.findOne({ url: newProject.url }).populate('image_project')
      //   response.success(req, res, projectFull, 201)
      // } catch (error) {
      //   return response.error(req, res, error, 500)
      // }
    } else {
      response.error(req, res, 'You dont have permission to do this action', 401)
    }
  }

  async updateProject(req, res) {
    let theImageExist;
    try {
      theImageExist = !req.file ? false : true
      const theProjectExist = await ProjectSchema.findOne({ url: req.body.url }).populate('image_project')
      if (!theProjectExist) return response.error(req, res, 'Project not found', 404)
      const projectToUpdate = req.body

      projectToUpdate.technologies = req.body.technologies == 'undefined' || !req.body.technologies ? theProjectExist.technologies : [...theProjectExist.technologies, req.body.technologies.split(',')].flat()
      projectToUpdate.technologies = projectToUpdate.technologies.filter(function(ele , pos){
        return projectToUpdate.technologies.indexOf(ele) == pos;
      }) 

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
            url: req.body.url
          },
          projectToUpdate,
          {
            new: true,
            runValidators: true
          }
        )
        return response.success(req, res, project, 201)
      } else {
        const photoFinded = await PhotoSchema.findOne({ _id: theProjectExist.image_project })
        projectToUpdate.image_project = photoFinded._id
        const project = await ProjectSchema.findOneAndUpdate(
          {
            url: req.body.url
          },
          projectToUpdate,
          {
            new: true,
            runValidators: true
          }
        )
        return response.success(req, res, project, 201)
      }
    } catch (error) {
      response.error(req, res, 'A problema has ocurred with creation', 201)
    }
  }

  async deleteProject(req, res) {
    try {      
      const project = await ProjectSchema.findOne({ _id: req.params.id }).populate('image_project')
      if (!project) return response.error(req, res, 'Project not found', 404)
      const idPhoto = project.image_project._id
      const idPublicPhoto = project.image_project.public_id
      await cloudinary.v2.uploader.destroy(idPublicPhoto)
      await PhotoSchema.findOneAndRemove({ _id: idPhoto })
      await ProjectSchema.findOneAndRemove({ _id: req.params.id })
      
      return response.success(req, res, 'Project deleted', 200)
    } catch (error) {
      response.error(req, res, error, 500)
    }
  }
}

const projectController = new ProjectController()
module.exports = projectController
