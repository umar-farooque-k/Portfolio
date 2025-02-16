const API_URL = 'https://api.jsonbin.io/v3/b/67b1b6b5e41b4d34e48ff797'; // Replace with your actual API URL
const API_KEY = '$2a$10$HhKEXe09/Hmecf0DDga7Hequ15tn2PgfVuEMSJ4cmjDjDbeEd7ipi'; // Replace with your JSONBin API key
const ACCESS_KEY = '$2a$10$nYWjCTX7sDdqPqpBgGEIh.ykGcztMMu/bwsQPNZXY/JucQI4gTyI6';

// Toggle password input when clicking "ADD"
function togglePasswordAccess() {
    document.getElementById('password-access').style.display = 'block';
}

// Show form if password is correct
function showForm() {
    const password = document.getElementById('password-input').value;
    const correctPassword = 'cr7'; // Change this if needed

    if (password === correctPassword) {
        document.getElementById('project-form').style.display = 'block';
        document.getElementById('password-access').style.display = 'none';
    } else {
        alert('Incorrect password!');
    }
}

// Fetch projects from JSONBin
async function fetchProjects() {
    try {
        let response = await fetch(API_URL, {
            headers: { 'X-Master-Key': API_KEY }
        });
        let data = await response.json();
        return data.record || [];
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

// Display projects on the page
async function displayProjects() {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    let projects = await fetchProjects();

    projects.forEach((project, index) => {
        const projectElement = document.createElement('div');
        projectElement.classList.add('project-item');
        projectElement.innerHTML = `
            <h3>${project.name}</h3>
            <img src="${project.image}" alt="${project.name}" class="project-image">
            <p>${project.description}</p><br>
            <p><strong>Tech Used:</strong> ${project.tech}</p><br>
            <a href="${project.github}" target="_blank">GitHub</a> | 
            <a href="${project.live}" target="_blank">Live Demo</a><br><br>
            <button class="delete-btn" onclick="promptDeleteProject(${index})">Delete</button>
        `;
        projectList.appendChild(projectElement);
    });
}

// Handle project submission
document.getElementById('addProjectForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const project = {
        name: document.getElementById('project-name').value,
        description: document.getElementById('project-description').value,
        image: document.getElementById('project-image').value,
        tech: document.getElementById('project-tech').value,
        github: document.getElementById('project-github').value,
        live: document.getElementById('project-live').value
    };

    let projects = await fetchProjects();
    projects.push(project);

    try {
        await fetch(API_URL, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify(projects)
        });

        displayProjects();
        document.getElementById('addProjectForm').reset();
    } catch (error) {
        console.error('Error adding project:', error);
    }
});

// Prompt for password before deleting project
function promptDeleteProject(index) {
    const password = prompt('Enter password to delete this project:');
    if (password === 'cr7') {
        deleteProject(index);
    } else {
        alert('Incorrect password!');
    }
}

// Delete a project
async function deleteProject(index) {
    let projects = await fetchProjects();
    projects.splice(index, 1);

    try {
        await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify(projects)
        });

        displayProjects();
    } catch (error) {
        console.error('Error deleting project:', error);
    }
}

// Load projects when the page loads
window.onload = displayProjects;
