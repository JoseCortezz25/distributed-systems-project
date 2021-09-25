document.addEventListener('DOMContentLoaded', () => {
  const skills = document.querySelector('.knowledge-list')
  const technologies = document.querySelector('.knowledge-list-updateproject')

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
      skills.delete(e.target.textContent);
      e.target.classList.remove('active');
    } else {
      skills.add(e.target.textContent);
      e.target.classList.add('active');
    }
  }
  console.log(skills);
  const skillsArray = [...skills];
  document.querySelector("#skills").value = skillsArray;
}

// Create a new project
const technologies = new Set()
const addTechnologies = e => {
  if (e.target.tagName === 'LI') {
    console.log('hola')
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

  console.log("selectedSkills")
  console.log(selectedSkills)
  selectedSkills.forEach(skill => {
    technologies.add(skill.textContent)
  })

  const technologiesArray = [...technologies]
  console.log(technologiesArray);
  document.querySelector("#technologies").value = technologiesArray
}
