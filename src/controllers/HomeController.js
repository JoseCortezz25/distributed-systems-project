const { contantsView: { titlePage, titleProject } } = require('../config/config')
const projectSchema = require('../models/Project')
const TITLE_PAGE = titlePage
// const projects = require('../lib/mocks')

class HomeController {
  home (req, res) {
    res.render('initial-page', {
      title: TITLE_PAGE,
      imageUrlCover: 'https://cdn.pixabay.com/photo/2015/04/20/13/17/work-731198_960_720.jpg',
      layout: 'SingleLayout.hbs'
    })
  }

  async homeUser (req, res) {
    try {
      const projects = await projectSchema.find().populate('image_project')
      console.log(projects)
      res.render('feed', {
        title: `Feed | ${TITLE_PAGE}`,
        titleProject,
        projects: projects
      })
    } catch (error) {
      res.status(500).send(error)

    }
  }

  /* 🍔 ---- Views ---- 🍔 */
  
  /* Render the home page view */
  initialPageView (req, res) {
    res.render('initial-page', {
      title: TITLE_PAGE,
      imageUrlCover: 'https://cdn.pixabay.com/photo/2015/04/20/13/17/work-731198_960_720.jpg',
      layout: 'SingleLayout.hbs'
    })
  }

  /* Render the user login page view */
  loginView (req, res) {
    res.render('login', {
      title: `Login | ${TITLE_PAGE}`,
      layout: 'SingleLayout.hbs'
    })
  }

  /* Render the user register page view */
  registerView (req, res) {
    res.render('register', {
      title: `Register | ${TITLE_PAGE}`,
      layout: 'SingleLayout.hbs'
    })
  }

  /* Render the feed page view */
  async feedView (req, res) {
    try {
      const projects = await projectSchema.find().populate('image_project')
      console.log(projects)
      res.render('feed', {
        title: `Feed | ${TITLE_PAGE}`,
        titleProject,
        projects: projects
      })
    } catch (error) {
      res.status(500).send(error)
    }
  }

  /* 🍎 ----  Logic ---- 🍎 */



}

const homeController = new HomeController()
module.exports = homeController
