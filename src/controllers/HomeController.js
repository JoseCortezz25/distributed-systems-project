const { contantsView: { titlePage, titleProject } } = require('../config/config')
const projectSchema = require('../models/Project')
const TITLE_PAGE = titlePage
// const projects = require('../lib/mocks')

class HomeController {
  home (req, res) {
    res.render('initial-page', {
      title: TITLE_PAGE,
      imageUrlCover: 'https://cdn.pixabay.com/photo/2015/04/20/13/17/work-731198_960_720.jpg'
    })
  }

  async homeUser (req, res) {

    const projects = await projectSchema.find()
    // console.log(projects)
    res.render('feed', {
      title: `Feed | ${TITLE_PAGE}`,
      titleProject,
      projects: projects
    })
  }
}

const homeController = new HomeController()
module.exports = homeController
