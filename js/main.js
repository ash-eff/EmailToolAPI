import { updateKeywordsSavedList, 
    updateKeywordOptionsList, 
    hideKeywordTypes, 
    clearKeywordOptions, 
    clearRemovedKeywords, 
    setKeywordTypes 
} from './keywords.js';

import { setProjects, currentProject } from './projects.js';

import { saveTemplate, 
    updateTemplate,
    getEmailTemplates, 
    generateEmail, 
    resetTemplateForm, 
    toggleTemplateButtons, 
    loadEmailButtons, 
    loadEditEmailButtons, 
    handleBuildEmailButtonClick, 
    deleteTemplate
} from './templates.js';

import { emailTemplatesView, 
    keywordTypes, 
    emailBody,
    emailField, 
    keywordOptions, 
    templateSaveButton, 
    templateViewButton, 
    emailBackButton,
    templateBuildButton,
    emailGenerateButton,
    emailCopyButton,
    templateEditButton,
    templateUpdateButton,
    templateDeleteButton
 } from './dom.js';

let currentView = emailTemplatesView;

export function setCurrentView(view) {
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

async function copyEmailText() {
    try {
        if (!emailField.value) {
            alert("No Email Text to Copy");
            return;
        }
        const emailText = emailField.value;
        console.log(emailText);
        await navigator.clipboard.writeText(emailText);
        alert("Email Text Copied");
    } catch (err) {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy text");
    }
}

keywordTypes?.addEventListener("input", () => hideKeywordTypes());
emailBody?.addEventListener("input", () => updateKeywordsSavedList());
keywordOptions?.addEventListener("input", () => updateKeywordOptionsList());
emailCopyButton?.addEventListener("click", () => copyEmailText());
templateDeleteButton?.addEventListener("click", () => {
    deleteTemplate()
    .then((message) => {
        alert(message);
        resetTemplateForm();
        clearKeywordOptions();
        clearRemovedKeywords();
        setCurrentView(emailTemplatesView);
        getEmailTemplates(currentProject.id)
        .then(() => {
            toggleTemplateButtons();
            loadEmailButtons();
        })
        .catch((error) => {
            console.error('Error fetching templates:', error);
            alert(`Error: ${error}`);
        });
    })
    .catch((error) => {
        console.error('Error deleting template:', error);
        alert(`Error: ${error}`);
    });  
});
templateUpdateButton?.addEventListener("click", () => {
    updateTemplate(toTitleCase)
    .then((message) => {
        alert(message);
        resetTemplateForm();
        clearKeywordOptions();
        clearRemovedKeywords();
        setCurrentView(emailTemplatesView);
        getEmailTemplates(currentProject.id)
        .then(() => {
            toggleTemplateButtons();
            loadEmailButtons();
        })
        .catch((error) => {
            console.error('Error fetching templates:', error);
            alert(`Error: ${error}`);
        });
    })
    .catch((error) => {
        console.error('Error updating template:', error);
        alert(`Error: ${error}`);
    });  
});
templateSaveButton?.addEventListener("click", () => {
    saveTemplate(toTitleCase)
    .then((message) => {
        alert(message);
        resetTemplateForm();
        clearKeywordOptions();
        clearRemovedKeywords();
        setCurrentView(emailTemplatesView);
        getEmailTemplates(currentProject.id)
        .then(() => {
            toggleTemplateButtons();
            loadEmailButtons();
        })
        .catch((error) => {
            console.error('Error fetching templates:', error);
            alert(`Error: ${error}`);
        });
    })
    .catch((error) => {
        console.error('Error saving template:', error);
        alert(`Error: ${error}`);
    });
});
templateViewButton?.addEventListener("click", () => {
    setCurrentView(emailTemplatesView);
    if (currentProject) {
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
    else {
        alert("Please select a project");
    }

});
emailBackButton?.addEventListener("click", () => {
    setCurrentView(emailTemplatesView);
    getEmailTemplates(currentProject.id)
    .then(() => {
        toggleTemplateButtons();
        loadEmailButtons();
    })
    .catch((error) => {
        console.error('Error fetching templates:', error);
        alert(`Error: ${error}`);
    });
});
templateEditButton?.addEventListener("click", () => {
    setCurrentView(emailTemplatesView);
    if (currentProject) {
        getEmailTemplates(currentProject.id)
        .then(() => {
            toggleTemplateButtons();
            loadEditEmailButtons();
        })
        .catch((error) => {
            console.error('Error fetching templates:', error);
            alert(`Error: ${error}`);
        });
    }
    else {
        alert("Please select a project");
    }
});

templateBuildButton?.addEventListener("click", () => handleBuildEmailButtonClick());
emailGenerateButton?.addEventListener("click", () => generateEmail());

templateSaveButton.disabled = true;
setProjects();
setKeywordTypes();

