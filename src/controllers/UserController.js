const { contantsView: { titlePage } } = require('../config/config')
const ProjectSchema = require('../models/Project');
const TITLE_PAGE = titlePage
const User = require('../models/User')

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
    res.render('addProject', {
      title: `Add new project | ${TITLE_PAGE}`
    })

  }

  async addProject (req, res) {
    try {
      const { name, description, technologies } = req.body;
      const project = new ProjectSchema({
        name,
        description
      })
      project.technologies = technologies.split(',');
  
      const newProject = await project.save();
  
      console.log(newProject);
      res.send("newProject")
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
