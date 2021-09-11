document.addEventListener('DOMContentLoaded', () => {
  const skills = document.querySelector('.knowledge-list');

  if (skills) {
    skills.addEventListener('click', agregarSkills);
    console.log('skills cargados');
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const technologies = document.querySelector('.knowledge-list-addproject');

  if (technologies) {
    technologies.addEventListener('click', addTechnologies);
    console.log('technologies cargados');
  }
})

const skills = new Set();
const agregarSkills = e => {
  // console.log(e.target);
  if (e.target.tagName === 'LI') {
    // console.log('si') 
    // console.log(e.target);
    if (e.target.classList.contains('active')) {
      skills.delete(e.target.textContent);
      e.target.classList.remove('active');
    } else {
      //console.log('no');
      skills.add(e.target.textContent);
      e.target.classList.add('active');
    }
  }
  console.log(skills);
  const skillsArray = [...skills];
  document.querySelector("#skills").value = skillsArray;
}


const technologies = new Set();
const addTechnologies = e => {
  // console.log(e.target);
  if (e.target.tagName === 'LI') {
    // console.log('si') 
    // console.log(e.target);
    if (e.target.classList.contains('active')) {
      technologies.delete(e.target.textContent);
      e.target.classList.remove('active');
    } else {
      //console.log('no');
      technologies.add(e.target.textContent);
      e.target.classList.add('active');
    }
  }
  console.log(technologies);
  const technologiesArray = [...technologies];
  document.querySelector("#technologies").value = technologiesArray;
}