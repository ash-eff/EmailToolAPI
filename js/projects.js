import { getEmailTemplates, toggleTemplateButtons, loadEmailButtons } from './templates.js';

import { projectOptions,
    emailTemplateHeader,
    templateSaveButton,
 } from "./dom.js";

export let currentProject = null;

export async function setProjects() {
    try {
        const response = await fetch("http://localhost:8000/get_projects/");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const projects = await response.json();
        projectOptions.innerHTML = '';

        const placeholderOption = document.createElement("option");
        placeholderOption.textContent = "Select Project";
        placeholderOption.value = "";
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        projectOptions.appendChild(placeholderOption);

        projects.forEach(project => {
            const option = document.createElement("option");
            option.textContent = project.name;
            projectOptions.appendChild(option);

            option.addEventListener("click", () => {
                handleProjectClick(project);
            });
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

async function handleProjectClick(project) {
    currentProject = project;
    emailTemplateHeader.textContent = `Email Templates for ${project.name}`;
    templateSaveButton.disabled = false;
    templateSaveButton.textContent = `Save Template for ${project.name}`;
    getEmailTemplates(currentProject.id)
    .then(() => {
        toggleTemplateButtons();
        loadEmailButtons();
    })
    .catch((error) => {
        console.error('Error fetching templates:', error);
        alert(`Error: ${error}`);
    });
}