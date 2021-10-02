document.addEventListener('DOMContentLoaded', () => {
  const skills = document.querySelector('.knowledge-list')
  const technologies = document.querySelector('.knowledge-list-updateproject')

  let alerts = document.querySelector('.alertas')

  if (alerts) {
    cleanAlerts()
  }

  if (skills) {
    skills.addEventListener('click', agregarSkills)
  }

  if (technologies) {
    technologies.addEventListener('click', addTechnologies)
    technologiesSelected()
  }
})

const skills = new Set()
const agregarSkills = e => {
  if (e.target.tagName === 'LI') {
    if (e.target.classList.contains('active')) {
      skills.delete(e.target.textContent)
      e.target.classList.remove('active')
    } else {
      skills.add(e.target.textContent)
      e.target.classList.add('active')
    }
  }
  const skillsArray = [...skills]
  document.querySelector("#skills").value = skillsArray
}

// Create a new project
const technologies = new Set()
const addTechnologies = e => {
  if (e.target.tagName === 'LI') {
    if (e.target.classList.contains('active')) {
      technologies.delete(e.target.textContent)
      e.target.classList.remove('active')
    } else {
      technologies.add(e.target.textContent)
      e.target.classList.add('active')
    }
  }
  console.log(technologies)
  const technologiesArray = [...technologies]
  document.querySelector("#technologies").value = technologiesArray
}

//Update a project
const technologiesSelected = ( ) => {
  const selectedSkills = Array.from(document.querySelectorAll('.knowledge-list-updateproject .active'))
  selectedSkills.forEach(skill => {
    technologies.add(skill.textContent)
  })

  const technologiesArray = [...technologies]
  document.querySelector("#technologies").value = technologiesArray
}

const cleanAlerts = () => {
  const alerts = document.querySelector('.alertas')
  const intervalCleanAlerts = setInterval(() => {
    if (alerts.children.length > 0) {
      alerts.removeChild(alerts.children[0])
    } else if (alerts.children.length === 0) {
      alerts.parentElement.removeChild(alerts)
      clearInterval(intervalCleanAlerts)
    }
  }, 1500)
}