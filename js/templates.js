import { keywords, populateSavedKeywords, updateKeywordOptionsList, setKeywordTypes } from "./keywords.js";
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
    templateEditView
} from "./dom.js";

export let currentEmailTemplate = null;
export const emailTemplates = [];

export async function getEmailTemplates(projectId, isEditing = false) {
    toggleEmailTemplateView(false);

    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`http://localhost:8000/get_email_templates/`);
    
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
    if (templateTitle.value === "") {
        alert("Please enter a title for the template.");
        return;
    }

    if (emailBody.value === "") {
        alert("Please enter a body for the email.");
        return;
    }

    if (keywords.size === 0) {
        alert("Please add keywords to the template.");
        return;
    }

    try {
        let keywordList = [];

        for (let keyword of keywords.values()) {
            if (keyword.name !== "") {
                const newKeyword = {
                    name: keyword.name,
                    type: keyword.type,
                    options: keyword.options
                };

                const response = await fetch("http://localhost:8000/keywords/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newKeyword)
                });

                if (!response.ok) {
                    throw new Error(`Failed to save keyword: ${keyword.name}`);
                }

                const data = await response.json();
                keywordList.push(data);
            }
        }

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
        return Promise.reject(error.message);
    }
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

export function handleEditEmailButtonClick(template) {
    setCurrentView(templateEditView);
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
    keywords.clear();
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