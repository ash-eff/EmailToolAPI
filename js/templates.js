import { keywords,
    populateSavedKeywords, 
    updateKeywordOptionsList, 
    setKeywordTypes, 
    resetKeywordForm, 
    clearKeywordList, 
    saveKeywords,
    updateKeywords,
    deleteKeywords } from "./keywords.js";
import { currentProject } from "./projects.js";
import { setCurrentView } from "./main.js";

import { templateButtons,
    templateWarningText,
    templateTitle,
    emailBody,
    emailField,
    emailFormContainer,
    emailGenerateButton,
    templateButtonsContainer,
    templateContainer,
    templateBuildView,
    templateSaveButtonContainer,
    templateEditButtonContainer
} from "./dom.js";

export let currentEmailTemplate = null;
export const emailTemplates = [];

export async function getEmailTemplates(projectId) {
    toggleEmailTemplateView(false);

    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`http://localhost:8000/email_templates/`);
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const templates = await response.json();
    
            emailTemplates.length = 0;
    
            for (let template of templates) {
                if (template.project.id === projectId) {
                    emailTemplates.push(template);
                }
            }

            resolve();
        } catch (error) {
            reject(`Error fetching templates: ${error}`);
        }
    });
}

export async function saveTemplate(toTitleCase) {
    try {
        await validateTemplate();

        let keywordList = await saveKeywords(keywords);

        let processedEmailBody = emailBody.value.replace(/\{([^\}]+)\}/g, (match, keyword) => {
            return `{${toTitleCase(keyword)}}`;
        });
        
        const template = {
            name: templateTitle.value,
            body: processedEmailBody,
            keywords: keywordList,
            project: currentProject
        };

        const templateResponse = await fetch("http://localhost:8000/email_templates/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(template)
        });

        if (!templateResponse.ok) {
            throw new Error("Failed to save template");
        }

        return Promise.resolve("Template saved successfully!");
    } catch (error) {
        console.error("Error in saveTemplate:", error);
        return Promise.reject(error.message);
    }
}

export async function updateTemplate(toTitleCase) {
    try {
        await validateTemplate();

        let keywordList = await updateKeywords(keywords);

        let processedEmailBody = emailBody.value.replace(/\{([^\}]+)\}/g, (match, keyword) => {
            return `{${toTitleCase(keyword)}}`;
        });

        const template = {
            name: templateTitle.value,
            body: processedEmailBody,
            keywords: keywordList,
            project: currentProject
        };

        const templateResponse = await fetch(`http://localhost:8000/email_templates/${currentEmailTemplate.id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(template)
        });

        if (!templateResponse.ok) {
            throw new Error("Failed to update template");
        }

        return Promise.resolve("Template updated successfully!");
    }
    catch (error) {
        console.error("Error in updateTemplate:", error);
        return Promise.reject(error.message);
    }
}

export async function deleteTemplate() {
    if (!confirm("Are you sure you want to delete this template?")) {
        return Promise.reject("Template deletion cancelled.");
    }   

    try {
        await deleteKeywords(keywords);

        const response = await fetch(`http://localhost:8000/email_templates/${currentEmailTemplate.id}/`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete template");
        }

        return Promise.resolve("Template deleted successfully!");
    } catch (error) {
        return Promise.reject(error.message);
    }
}

function validateTemplate() {
    if (templateTitle.value === "") {
        return Promise.reject("Please enter a title for the template.");
    }

    if (emailBody.value === "") {
        return Promise.reject("Please enter a body for the email.");
    }

    if (keywords.size === 0) {
        return Promise.reject("Please add keywords to the template.");
    }

    return Promise.resolve();
}

export function generateEmail() {
    const formElements = emailFormContainer.children;

    for (let i = 0; i < formElements.length - 1; i++) {
        const input = formElements[i].querySelector('input, select, textarea');
        if (input.value === "") {
            alert("Please fill out all fields before generating the email.");
            return;
        }
    }
    
    let emailBodyText = currentEmailTemplate.body;

    for (let i = 0; i < formElements.length - 1; i++) {
        const label = formElements[i].querySelector('label');
        const input = formElements[i].querySelector('input, select, textarea');

        if (label && input) {
            const keyword = label.textContent.trim();
            const value = input.value;

            const regex = new RegExp(`{${keyword}}`, 'g');
            emailBodyText = emailBodyText.replace(regex, value);
        }
    }
    emailBodyText += "\n" + currentProject.signature_block;

    emailField.value = emailBodyText;
}

function showSaveButton(show){
    if (show) {
        templateSaveButtonContainer.classList.remove("hidden");
        templateSaveButtonContainer.classList.add("visible");
    }
    else {
        templateSaveButtonContainer.classList.remove("visible");
        templateSaveButtonContainer.classList.add("hidden");
    }
}

function showEditButton(show){
    if (show) {
        templateEditButtonContainer.classList.remove("hidden");
        templateEditButtonContainer.classList.add("visible");
    }
    else {
        templateEditButtonContainer.classList.remove("visible");
        templateEditButtonContainer.classList.add("hidden");
    }
}

function clearEmailForm() {
    emailField.value = "";
    while (emailFormContainer.children.length > 1) {
        emailFormContainer.removeChild(emailFormContainer.firstChild);
    }
}

export function handleEmailButtonClick(template) {
    toggleEmailTemplateView(true);
    clearEmailForm();
    currentEmailTemplate = template;
    if (currentEmailTemplate.keywords.length > 0) {
        for (let keyword of currentEmailTemplate.keywords) {
            const li = document.createElement("li");

            const label = document.createElement("label");
            label.setAttribute("for", keyword.name);
            label.textContent = keyword.name;

            li.appendChild(label);

            if (keyword.type === "Dropdown Menu") {
                const select = document.createElement("select");
                select.setAttribute("id", keyword.name);
                select.setAttribute("name", keyword.name);

                for (let option of keyword.options) {
                    const optionElement = document.createElement("option");
                    optionElement.setAttribute("value", option);
                    optionElement.textContent = option;
                    select.appendChild(optionElement);
                }

                li.appendChild(select);
            }
            else if (keyword.type === "Input Field") {
                const input = document.createElement("input");
                input.setAttribute("type", "text");
                input.setAttribute("id", keyword.name);
                input.setAttribute("name", keyword.name);
                input.setAttribute("placeholder", "Enter " + keyword.name);

                li.appendChild(input);
            }

            emailFormContainer.insertBefore(li, emailGenerateButton);
        }        
    }
}

export function handleBuildEmailButtonClick() {
    resetTemplateForm();
    resetKeywordForm();
    clearKeywordList();
    showSaveButton(true);
    showEditButton(false);
    setCurrentView(templateBuildView);
}

export function handleEditEmailButtonClick(template) {
    resetTemplateForm();
    resetKeywordForm();
    clearKeywordList();
    showSaveButton(false);
    showEditButton(true);
    setCurrentView(templateBuildView);
    currentEmailTemplate = template;
    templateTitle.value = currentEmailTemplate.name;
    emailBody.value = currentEmailTemplate.body;
    setKeywordTypes();
    populateSavedKeywords(currentEmailTemplate.keywords);
    updateKeywordOptionsList();
}

export function resetTemplateForm() {
    templateTitle.value = "";
    emailBody.value = "";
}

function toggleEmailTemplateView(turnOn) {
    if (turnOn) {
        templateButtonsContainer.classList.remove("visible");
        templateButtonsContainer.classList.add("hidden");
        templateContainer.classList.remove("hidden");
        templateContainer.classList.add("visible");
    }
    else {
        templateButtonsContainer.classList.remove("hidden");
        templateButtonsContainer.classList.add("visible");
        templateContainer.classList.remove("visible");
        templateContainer.classList.add("hidden");
    }
}

export function toggleTemplateButtons() {
    if (emailTemplates.length === 0) {
        templateButtons.classList.remove("visible");
        templateButtons.classList.add("hidden");
        templateWarningText.classList.remove("hidden");
        templateWarningText.classList.add("visible");
    }
    else {
        templateButtons.classList.remove("hidden");
        templateButtons.classList.add("visible");
        templateWarningText.classList.remove("visible");
        templateWarningText.classList.add("hidden");
    }
}

export function loadEmailButtons() {
    templateButtons.innerHTML = "";
    for (let template of emailTemplates) {
        const button = document.createElement("button");
        button.classList.add("grid-button");
        button.textContent = template.name;
        button.addEventListener("click", () => handleEmailButtonClick(template));
        templateButtons.appendChild(button);
    }
}

export function loadEditEmailButtons() {
    templateButtons.innerHTML = "";
    for (let template of emailTemplates) {
        const button = document.createElement("button");
        button.classList.add("grid-edit-button");
        button.textContent = template.name;
        button.addEventListener("click", () => handleEditEmailButtonClick(template));
        templateButtons.appendChild(button);
    }
}