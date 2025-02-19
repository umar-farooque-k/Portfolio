// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "portfolio-5c023.firebaseapp.com",
    projectId: "portfolio-5c023",
    storageBucket: "portfolio-5c023.appspot.com",
    messagingSenderId: "714065630728",
    appId: "1:714065630728:web:49181c38a41db85e9923bd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Admin password
const ADMIN_PASSWORD = "cr7";

// Ensure DOM is loaded before executing
document.addEventListener("DOMContentLoaded", () => {
    const addProjectBtn = document.getElementById("add-project-btn");
    const passwordAccessDiv = document.getElementById("password-access");
    const passwordSubmitBtn = document.getElementById("password-submit");
    const projectForm = document.getElementById("project-form");
    const addProjectForm = document.getElementById("addProjectForm");

    // Hide form & password box initially
    projectForm.style.display = "none";
    passwordAccessDiv.style.display = "none";

    // Show password input when "Add" button is clicked
    addProjectBtn.addEventListener("click", () => {
        passwordAccessDiv.style.display = "block";
    });

    // Validate password before showing the form
    passwordSubmitBtn.addEventListener("click", () => {
        const password = document.getElementById("password-input").value.trim();
        if (password === ADMIN_PASSWORD) {
            projectForm.style.display = "block"; // Show the form
            passwordAccessDiv.style.display = "none"; // Hide password input
        } else {
            alert("❌ Incorrect password!");
        }
    });

    // Handle project submission
    addProjectForm.addEventListener("submit", addProject);
    displayProjects();
});

// Display projects from Firestore
async function displayProjects() {
    const projectList = document.getElementById("project-list");
    projectList.innerHTML = "<p>Loading projects...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        projectList.innerHTML = "";

        querySnapshot.forEach(docSnapshot => {
            const project = docSnapshot.data();
            const projectId = docSnapshot.id;

            projectList.innerHTML += `
                <div class="project-item">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    ${project.image ? `<img src="${project.image}" class="project-image" alt="Project Image">` : ""}
                    <p><b>Technologies:</b> ${project.tech || "Not specified"}</p>
                    <p>
                        ${project.github ? `<a href="${project.github}" target="_blank">GitHub</a> | ` : ""}
                        ${project.live ? `<a href="${project.live}" target="_blank">Live Demo</a>` : ""}
                    </p>
                    <button class="delete-btn" onclick="confirmDelete('${projectId}')">Delete</button>
                </div>
            `;
        });

        if (querySnapshot.empty) {
            projectList.innerHTML = "<p>No projects found.</p>";
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        projectList.innerHTML = "<p>⚠️ Failed to load projects.</p>";
    }
}

// Add a new project to Firestore
async function addProject(event) {
    event.preventDefault();

    const name = document.getElementById("project-name").value.trim();
    const description = document.getElementById("project-description").value.trim();
    const image = document.getElementById("project-image").value.trim();
    const tech = document.getElementById("project-tech").value.trim();
    const github = document.getElementById("project-github").value.trim();
    const live = document.getElementById("project-live").value.trim();

    if (!name || !description) {
        alert("⚠️ Project name and description are required!");
        return;
    }

    try {
        await addDoc(collection(db, "projects"), { name, description, image, tech, github, live });
        alert("✅ Project added successfully!");
        
        document.getElementById("addProjectForm").reset();
        document.getElementById("project-form").style.display = "none"; // Hide form after submission

        displayProjects();
    } catch (error) {
        console.error("Error adding project:", error);
        alert("❌ Failed to add project.");
    }
}

// Ask for password before deleting a project
window.confirmDelete = function (projectId) {
    const password = prompt("🔑 Enter Admin Password to Delete:");
    if (password === ADMIN_PASSWORD) {
        deleteProject(projectId);
    } else {
        alert("❌ Incorrect password! Deletion canceled.");
    }
};

// Delete a project from Firestore
async function deleteProject(projectId) {
    try {
        await deleteDoc(doc(db, "projects", projectId));
        alert("🗑️ Project deleted successfully!");
        displayProjects();
    } catch (error) {
        console.error("Error deleting project:", error);
        alert("❌ Failed to delete project.");
    }
};
