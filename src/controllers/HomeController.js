const { contantsView: { titlePage, titleProject } } = require('../config/config')
const TITLE_PAGE = titlePage
const projects = require('../lib/mocks')

class HomeController {
  home (req, res) {
    res.render('initial-page', {
      title: TITLE_PAGE,
      imageUrlCover: 'https://cdn.pixabay.com/photo/2015/04/20/13/17/work-731198_960_720.jpg'
    })
  }

  homeUser (req, res) {
    res.render('feed', {
      title: `Feed | ${TITLE_PAGE}`,
      titleProject,
      projects
    })
  }
}

const homeController = new HomeController()
module.exports = homeController
