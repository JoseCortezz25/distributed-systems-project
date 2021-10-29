module.exports = {
  seleccionarSkills: (selected = [], opciones) => {
    const skills = ['Html5', 'Css3', 'Python', 'Java', 'Javascript',
      'Jquery', 'Laravel', 'R', 'Apollo', 'Graphql', 'Typescript',
      'Mongoose', 'Sequelize', 'SQL', 'MVC', 'WordPress', 'Angular',
      'Node', 'Express', 'Php'
    ]
    let html = ''
    skills.forEach(skill => {
      html += `<li ${selected.includes(skill) ? 'class="active"' : ''}>${skill}</li>`
    })
    // eslint-disable-next-line no-return-assign
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
      html += `<li ${selected.includes(technology) ? 'class="active"' : ''}>${technology}</li>`
    })
    // eslint-disable-next-line no-return-assign
    return options.fn().html = html
  },

  showAlerts: (errors = {}, alerts) => {
    const category = Object.keys(errors)
    console.log(category)
    console.log(errors)
    let html = ''
    // const errorsExists = category[1] ? true : false
    // console.log(errorsExists);
    // if (!errorsExists) {
    if (category.length) {
      errors[category].forEach(error => {
        html += `<div class="${category} alerta">${error}</div>`
      })
    }
    // }
    // eslint-disable-next-line no-return-assign
    return alerts.fn().html = html
  },

  validUserToUpdateProject: (loggedUser, projectOwner) => {
    if (!loggedUser) return false
    return loggedUser._id.toString() === projectOwner._id.toString()
  }
}
