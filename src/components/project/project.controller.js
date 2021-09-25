const cloudinary = require('cloudinary')
const ProjectSchema = require('../../models/Project')
const PhotoSchema = require('../../models/Photo')
const response = require('../../lib/response')
const colors = require('colors')
const { 
  contantsView: { 
    titlePage 
  }, 
  cloudinary: { 
    cloud_name, 
    api_key, 
    api_secret 
  } 
} = require('../../config/config')
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret
})

class ProjectController {
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

  async getProjectByUrl (req, res) {
    try {
      const project = await ProjectSchema.findOne({url: req.params.url}).populate('image_project')
      if (!project) {
        return response.error(res, req, 'Project not found', 404)
      }
      return  response.success(res, req, project, 200)
    } catch (error) {
      response.error(res, req, error, 500)
    }
  }

  async addProject (req, res) {
    const { filename, path, size, mimetype, originalname } = req.file
    const { name, description, technologies } = req.body
    try {
      const result = await cloudinary.v2.uploader.upload(path)
      const project = new ProjectSchema({
        name,
        description
      })
      project.technologies = technologies.split(',');
      const newProject = await project.save();
      const photo = new PhotoSchema({
        filename,
        originalname,
        mimetype,
        size,
        imageURL: result.url,
        public_id: result.public_id
      })
      
      const newPhoto = await photo.save()
      const projectWithPhoto = await ProjectSchema.findOneAndUpdate(
        { url: newProject.url }, 
        {image_project: newPhoto._id},
        { 
          new: true,
          runValidators: true
        }
      )
      response.success(res, req, projectWithPhoto, 201)
    } catch (error) {
      console.log(error)
      response.error(res, req, error, 500)
    }
  }

  async updateProject(req, res) {
    try {
      if (!req.params.url) {
        return response.error(res, req, 'URL parameter is required', 404)
      }
      console.group(colors.bgGreen.black('Update Project'))
      console.log('req.body', req.body)
      // console.log('url', url)
      console.log('req.file', req.file)

      const theProjectExist = await ProjectSchema.findOne({ url: req.params.url }).populate('image_project')
      if (!theProjectExist) {
        return response.error(res, req, 'Project not found. ', 404)
      }
      console.log(colors.bgCyan('theProjectExist'), theProjectExist)
      // const theProjectExist = await ProjectSchema.findOne({ url: req.params.url }).populate('image_project')
      // if (!theProjectExist) res.redirect('/*')

      // const { filename, path, size, mimetype, originalname } = req.file || theProjectExist.image_project
      // const projectToUpdate = req.body
      
      // const result = await cloudinary.v2.uploader.upload(path)
      // const updatedImage = await PhotoSchema.findOneAndUpdate({
      //   _id: theProjectExist.image_project
      // },
      //   {
      //     filename,
      //     path,
      //     originalname,
      //     mimetype,
      //     size,
      //     imageURL: result.url,
      //     public_id: result.public_id
      //   },
      //   {
      //     new: true,
      //     runValidators: true
      //   }
      // )
      // projectToUpdate.image_project = updatedImage._id
      // projectToUpdate.technologies = !projectToUpdate.technologies ? theProjectExist.technologies : [...theProjectExist.technologies, ...projectToUpdate.technologies.split(',')]
      // const project = await ProjectSchema.findOneAndUpdate(
      //   {
      //     url: req.params.url
      //   },
      //   projectToUpdate,
      //   {
      //     new: true,
      //     runValidators: true
      //   }
      // )
      // res.redirect(`/project/${project.url}`)
      console.groupEnd()

    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }
}

const projectController = new ProjectController()
module.exports = projectController
