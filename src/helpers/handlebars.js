module.exports = {

  seleccionarSkills: (seleccionadas = [], opciones) => {
    const skills = ['Html5', 'Css3', 'Python', 'Java', 'Javascript',
      'Jquery', 'Laravel', 'R', 'Apollo', 'Graphql', 'Typescript',
      'Mongoose', 'Sequelize', 'SQL', 'MVC', 'WordPress', 'Angular',
      'Node', 'Express', 'Php'
    ];

    let html = '';

    skills.forEach(skill => {
      html += `<li>${skill}</li>`;
    });

    return opciones.fn().html = html;
  },

  selectTechnologies: (select = [], options) => {
    const technologies = ['HTML', 'CSS', 'Python', 'Java', 'JavaScript',
      'Jquery', 'Laravel', 'R', 'Apollo', 'Graphql', 'TypeScript',
      'Mongoose', 'Sequelize', 'SQL', 'MVC', 'WordPress', 'Angular',
      'Node', 'Express', 'Php', 'Postgres', 'MySQL'
    ];

    let html = '';

    technologies.forEach(technology => {
      html += `<li>${technology}</li>`;
    });

    return options.fn().html = html;
  }
}

