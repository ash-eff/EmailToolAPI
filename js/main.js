import { updateKeywordsSavedList, updateKeywordOptionsList, hideKeywordTypes, clearKeywordOptions, removeKeywords } from './keywords.js';
import { setProjects, currentProject } from './projects.js';
import { saveTemplate, getEmailTemplates, generateEmail, resetTemplateForm } from './templates.js';
import { emailTemplatesView, 
    keywordTypes, 
    emailBody, 
    keywordOptions, 
    templateSaveButton, 
    templateViewButton, 
    emailBackButton,
    templateBuildButton,
    emailGenerateButton,
    templateBuildView } from './dom.js';

let currentView = emailTemplatesView;

function setCurrentView(view) {
    currentView.classList.remove("visible");
    currentView.classList.add("hidden");
    view.classList.remove("hidden");
    view.classList.add("visible");
    currentView = view;
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

keywordTypes?.addEventListener("input", () => hideKeywordTypes());
emailBody?.addEventListener("input", () => updateKeywordsSavedList());
keywordOptions?.addEventListener("input", () => updateKeywordOptionsList());

templateSaveButton?.addEventListener("click", () => {
    saveTemplate(toTitleCase)
    .then((message) => {
        alert(message);
        resetTemplateForm();
        updateKeywordsSavedList();
        clearKeywordOptions();
        removeKeywords();
        setCurrentView(emailTemplatesView);
        getEmailTemplates(currentProject.id);
    })
    .catch((error) => {
        alert(`Error: ${error}`);
    });
});

templateViewButton?.addEventListener("click", () => {
    setCurrentView(emailTemplatesView);
    getEmailTemplates(currentProject.id);
});
emailBackButton?.addEventListener("click", () => {
    setCurrentView(emailTemplatesView);
    getEmailTemplates(currentProject.id);
});

templateBuildButton?.addEventListener("click", () => setCurrentView(templateBuildView));
emailGenerateButton?.addEventListener("click", () => generateEmail(emailField));

templateSaveButton.disabled = true;
setProjects();
// handleKeywordTypeClick();

