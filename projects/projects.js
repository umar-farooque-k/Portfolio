const correctPassword = 'cr7';

        // Toggle password input when clicking "ADD"
        function togglePasswordAccess() {
            document.getElementById('password-access').style.display = 'block';
        }

        // Show form if password is correct
        function showForm() {
            const password = document.getElementById('password-input').value;

            if (password === correctPassword) {
                document.getElementById('project-form').style.display = 'block';
                document.getElementById('password-access').style.display = 'none';
            } else {
                alert('Incorrect password!');
            }
        }

        // Handle project submission
        document.getElementById('addProjectForm').addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('project-name').value;
            const description = document.getElementById('project-description').value;
            const image = document.getElementById('project-image').value;
            const tech = document.getElementById('project-tech').value;
            const github = document.getElementById('project-github').value;
            const live = document.getElementById('project-live').value;

            const project = { name, description, image, tech, github, live };

            let projects = JSON.parse(localStorage.getItem('projects')) || [];
            projects.push(project);
            localStorage.setItem('projects', JSON.stringify(projects));

            displayProjects();
            document.getElementById('addProjectForm').reset();
        });

        // Display projects
        function displayProjects() {
            const projectList = document.getElementById('project-list');
            projectList.innerHTML = '';

            let projects = JSON.parse(localStorage.getItem('projects')) || [];

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

        // Prompt for password before deleting project
        function promptDeleteProject(index) {
            const password = prompt('Enter password to delete this project:');
            if (password === correctPassword) {
                deleteProject(index);
            } else {
                alert('Incorrect password!');
            }
        }

        // Delete project
        function deleteProject(index) {
            let projects = JSON.parse(localStorage.getItem('projects')) || [];
            projects.splice(index, 1);
            localStorage.setItem('projects', JSON.stringify(projects));
            displayProjects();
        }

        window.onload = displayProjects;