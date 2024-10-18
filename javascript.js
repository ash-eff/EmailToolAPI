const emailBody = document.getElementById("email-body");
const highlightedArea = document.getElementById('highlighted-text');

const keywordsSavedList = document.getElementById("keywords-saved");
const keywordName = document.getElementById("keyword-name");
const keywordTypes = document.getElementById("keyword-types");
const keywordOptions = document.getElementById("keyword-options");
const keywordOptionsContainer = document.getElementById("keyword-options-container");
const templateTitle = document.getElementById("template-title");
const projectOptions = document.getElementById("project-options");
const emailTemplateHeader = document.getElementById("email-template-header");
const templateWarningText = document.getElementById("template-warning-text");
const templateButtons = document.getElementById("template-buttons");
const emailFormContainer = document.getElementById("email-form-container");
const templateButtonsContainer = document.getElementById("template-buttons-container");
const templateContainer = document.getElementById("template-container");

const emailTemplatesView = document.getElementById("email-templates-container");
const templateBuildView = document.getElementById("template-build-container");

const templateViewButton = document.getElementById("template-view-button");
const templateBuildButton = document.getElementById("template-build-button");
const templateSaveButton = document.getElementById("template-save-button");
const emailGenerateButton = document.getElementById("email-generate-button");
const emailBackButton = document.getElementById("email-back-button");

class Keyword {
    constructor(name, type, options = [], description = "") {
        this.name = name;
        this.type = type;
        this.options = options;
        this.description = description;
    }
}

let currentView = emailTemplatesView;
let currentProject = null;
const keywords = new Map();
const removedKeywords = new Map();
const emailTemplates = [];

async function setKeywordTypes() {
    try {
        const response = await fetch("http://localhost:8000/keyword_types/");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const types = await response.json();

        keywordTypes.innerHTML = '';

        types.forEach(type => {
            const option = document.createElement("option");
            option.textContent = type;
            keywordTypes.appendChild(option);

            option.addEventListener("click", () => {
                handleKeywordTypeClick(type);
            });
        });
    } catch (error) {
        console.error('Error fetching types:', error);
    }
}

async function setProjects() {
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

function updateKeywordsSavedList() {
    keywordsSavedList.innerHTML = '';

    const emailContent = emailBody.value;
    const newKeyword = new Keyword();

    const regex = /\{([^{}]*?)\}/g;
    let matches;
    let currentKeywords = new Set();

    while ((matches = regex.exec(emailContent)) !== null) {
        const keyword = matches[1].trim();
        currentKeywords.add(keyword);

        if (!keywords.has(keyword)) {
            if(removedKeywords.has(keyword)) {
                newKeyword.name = keyword;
                newKeyword.type = removedKeywords.get(keyword).type;
                newKeyword.options = removedKeywords.get(keyword).options;
                keywords.set(keyword, newKeyword);
                removedKeywords.delete(keyword);
            }
            else {
                newKeyword.name = keyword;
                newKeyword.type = keywordTypes[0].value;
                keywords.set(keyword, newKeyword);
            }
        }
    }

    keywords.forEach((value, keyword) => {
        const option = document.createElement("option");
        option.textContent = keyword;
        option.value = keyword
    
        option.addEventListener("click", () => {
            handleSavedKeywordClick(keyword);
        });
    
        keywordsSavedList.appendChild(option);
    });

    const keywordsToRemove = [...keywords.keys()].filter(keyword => !currentKeywords.has(keyword));
    for (let keyword of keywordsToRemove) {
        removedKeywords.set(keyword, keywords.get(keyword));
        keywords.delete(keyword);
        resetKeywordForm();
        hideKeywordTypes();
    }

    let selected = keywordsSavedList.selectedIndex = keywordsSavedList.length - 1;
    if (selected >= 0) {
        updateKeywordName(keywordsSavedList[selected].value);
        updateKeywordType(keywords.get(keywordsSavedList[selected].value).type);
        updateKeywordOptions(keywords.get(keywordsSavedList[selected].value).options);
        hideKeywordTypes();
    }
    else {
        resetKeywordForm();
    }
}

function updateKeywordOptionsList() {
    let currentKeyword = keywords.get(keywordName.value);
    let options = keywordOptions.value.split(/,|\n/);
    currentKeyword.options = options;
}

function clearKeywordOptions() {
    keywordOptions.value = "";
}

function updateKeywordName(name) {
    keywordName.value = name;
}

function updateKeywordType(type) {
    keywordTypes.value = type;
}

function updateKeywordOptions(options) {
    keywordOptions.value = options;
}

function resetKeywordForm() {
    updateKeywordName("");
    updateKeywordType("Input Field");
    clearKeywordOptions();
    hideKeywordTypes();
}

function handleSavedKeywordClick(keyword) {
    updateKeywordName(keyword);
    updateKeywordType(keywords.get(keyword).type);
    updateKeywordOptions(keywords.get(keyword).options);
    hideKeywordTypes();
}

function handleKeywordTypeClick(type) {
    hideKeywordTypes();
    let keyword = keywords.get(keywordName.value);
    keyword.type = type;
}

async function handleProjectClick(project) {
    currentProject = project;
    emailTemplateHeader.textContent = `Email Templates for ${project.name}`;
    templateSaveButton.disabled = false;
    templateSaveButton.textContent = `Save Template for ${project.name}`;
    getEmailTemplates(project.id);
}

async function getEmailTemplates(projectId) {
    toggleEmailTemplateView(false);
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
    } catch (error) {
        console.error('Error fetching templates:', error);
    }

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
        loadEmailButtons();
    }
}

function loadEmailButtons() {
    templateButtons.innerHTML = "";
    for (let template of emailTemplates) {
        const button = document.createElement("button");
        button.classList.add("grid-button");
        button.textContent = template.name;
        button.addEventListener("click", () => handleEmailButtonClick(template));
        templateButtons.appendChild(button);
    }
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

function handleEmailButtonClick(template) {
    toggleEmailTemplateView(true);
    clearEmailForm();
    if (template.keywords.length > 0) {
        for (let keyword of template.keywords) {
            console.log("Keyword:", keyword);
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

function clearEmailForm() {
    // remove all chidren from emailFormContainer except for emailGenerateButton
    while (emailFormContainer.children.length > 1) {
        emailFormContainer.removeChild(emailFormContainer.firstChild);
    }
}

function hideKeywordTypes() {
    if (keywordTypes.value === "Dropdown Menu") {
        keywordOptionsContainer.classList.remove("hidden");
        keywordOptionsContainer.classList.add("visible");
    }
    else {
        keywordOptionsContainer.classList.remove("visible");
        keywordOptionsContainer.classList.add("hidden");
    }
}

async function saveTemplate() {
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

        const template = {
            name: templateTitle.value,
            body: emailBody.value,
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

        alert("Template saved successfully!");
        resetTemplateForm();
        setCurrentView(emailTemplatesView);
        getEmailTemplates(currentProject.id);
    } catch (error) {
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
    }
}

function resetTemplateForm() {
    templateTitle.value = "";
    emailBody.value = "";
    keywords.clear();
    removedKeywords.clear();
    updateKeywordsSavedList();
}

function setCurrentView(view) {
    currentView.classList.remove("visible");
    currentView.classList.add("hidden");
    view.classList.remove("hidden");
    view.classList.add("visible");
    currentView = view;
}

function generateEmail() {
    //generate email
}

keywordTypes?.addEventListener("input", () => hideKeywordTypes());
emailBody?.addEventListener("input", () => updateKeywordsSavedList());
keywordOptions?.addEventListener("input", () => updateKeywordOptionsList());
templateSaveButton?.addEventListener("click", () => saveTemplate());
templateViewButton?.addEventListener("click", () => {
    setCurrentView(emailTemplatesView);
    getEmailTemplates(currentProject.id);
});
emailBackButton?.addEventListener("click", () => {
    setCurrentView(emailTemplatesView);
    getEmailTemplates(currentProject.id);
});
templateBuildButton?.addEventListener("click", () => setCurrentView(templateBuildView));
emailGenerateButton?.addEventListener("click", () => generateEmail());

templateSaveButton.disabled = true;
setProjects();
setKeywordTypes();