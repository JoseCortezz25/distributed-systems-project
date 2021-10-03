module.exports = {
  seleccionarSkills: (selected = [], opciones) => {
    const skills = ['Html5', 'Css3', 'Python', 'Java', 'Javascript',
      'Jquery', 'Laravel', 'R', 'Apollo', 'Graphql', 'Typescript',
      'Mongoose', 'Sequelize', 'SQL', 'MVC', 'WordPress', 'Angular',
      'Node', 'Express', 'Php'
    ]
    let html = ''
    skills.forEach(skill => {
      html+=`<li ${selected.includes(skill) ? 'class="active"':''}>${skill}</li>`
    })
    return opciones.fn().html = html
  },

  selectTechnologies: (selected = [], options) => {
    const technologies = ['HTML', 'CSS', 'Python', 'Java', 'JavaScript',
      'Jquery', 'Laravel', 'R', 'Apollo', 'Graphql', 'TypeScript',
      'Mongoose', 'Sequelize', 'SQL', 'MVC', 'WordPress', 'Angular',
      'Node', 'Express', 'Php', 'Postgres', 'MySQL', 'React', 'Svelte'
    ]
    let html = ''
    technologies.forEach(technology => {
      html+=`<li ${selected.includes(technology) ? 'class="active"':''}>${technology}</li>`
    })
    return options.fn().html = html
  },

  showAlerts: (errors = {}, alerts) => {
    const category = Object.keys(errors)
    let html = ''
    if(category.length){
      errors[category].forEach(error => {
        html+=`<div class="${category} alerta">${error}</div>`
      })
    }
    return alerts.fn().html = html
  },

  validUserToUpdateProject: (loggedUser, projectOwner) => {
    if (!loggedUser) return false
    return loggedUser._id.toString() === projectOwner._id.toString()
  }
}
