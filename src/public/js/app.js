import axios from 'axios'
import Swal from 'sweetalert2'

document.addEventListener('DOMContentLoaded', () => {
  const skills = document.querySelector('.knowledge-list')
  const technologies = document.querySelector('.knowledge-list-updateproject')
  const alerts = document.querySelector('.alertas')
  const btnDeleteProject = document.querySelector('.btn-delete')
  const containerControlButtons = document.querySelector('.control-buttons')

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

  if (containerControlButtons) {
    btnDeleteProject.addEventListener('click', deleteOneProject)
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
  document.querySelector('#skills').value = skillsArray
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
  document.querySelector('#technologies').value = technologiesArray
}

// Update a project
const technologiesSelected = () => {
  const selectedSkills = Array.from(document.querySelectorAll('.knowledge-list-updateproject .active'))
  selectedSkills.forEach(skill => {
    technologies.add(skill.textContent)
  })

  const technologiesArray = [...technologies]
  document.querySelector('#technologies').value = technologiesArray
}

// Clean alerts
const cleanAlerts = () => {
  const alerts = document.querySelector('.alertas')

  console.log('-------alerts-------')
  console.log(alerts)

  const intervalCleanAlerts = setInterval(() => {
    if (alerts.children.length > 0) {
      alerts.removeChild(alerts.children[0])
    } else if (alerts.children.length === 0) {
      alerts.parentElement.removeChild(alerts)
      clearInterval(intervalCleanAlerts)
    }
  }, 1500)
}

const deleteOneProject = (e) => {
  e.preventDefault()
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      const url = `${window.location.origin}/api/delete-project/${e.target.dataset.delete}`
      axios.delete(url)
        .then(res => {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          ).then((result) => {
            if (result.isConfirmed) {
              window.location.assign(`${window.location.origin}/feed`)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
      e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement)
    }
  })
}
