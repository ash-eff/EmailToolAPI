const emailBody = document.getElementById("email-body");

const keywordsList = document.getElementById("keywords-list");
const keywordName = document.getElementById("keyword-name");
const keywordTypes = document.getElementById("keyword-types");

const createTemplateButton = document.getElementById("create-template-button");
const updateKeywordButton = document.getElementById("update-keyword-button");
const removeKeywordButton = document.getElementById("remove-keyword-button");

const keywords = new Map();

async function setKeywordTypes() {
    try {
        const response = await fetch("http://localhost:8000/keyword_types");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const types = await response.json();

        keywordTypes.innerHTML = '';

        types.forEach(type => {
            const option = document.createElement("option");
            option.textContent = type;
            keywordTypes.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching types:', error);
    }
}

function updateSavedKeywords() {
    keywordsList.innerHTML = '';

    const emailContent = emailBody.value;

    const regex = /\{([^}]+)\}/g;
    let matches;
    let currentKeywords = new Set();
    
    while ((matches = regex.exec(emailContent)) !== null) {
        const keyword = matches[1].trim();
        currentKeywords.add(keyword);
        if (!keywords.has(keyword)) {
            keywords.set(keyword, undefined);
        }
    }

    for (let keyword of keywords.keys()) {
        if (!currentKeywords.has(keyword)) {
            keywords.delete(keyword);
        }
    }

    keywords.forEach((value, keyword) => {
        const option = document.createElement("option");
        option.textContent = keyword;
    
        option.addEventListener("click", () => {
            handleKeywordClick(keyword);
        });
    
        keywordsList.appendChild(option);
    });
}

function handleKeywordClick(keyword) {
    if(keywords.has(keyword)) {
        keywordName.value = keyword;
        if(keywords.get(keyword) === undefined) {
            keywordValue.placeholder = "Enter a value for this keyword";
            keywordValue.value = "";
        }
        else{
            keywordValue.value = keywords.get(keyword);
            keywordValue.placeholder = "";
        }
    }
}

function updateKeywordValue() {
    const keyword = keywordName.value;
    const value = keywordValue.value;

    keywords.set(keyword, value);
    updateSavedKeywords();
}

function updateKeyword() {
    console.log("Updating keyword...");
}

function removeKeyword() {
    console.log("Removing keyword...");
}

function createTemplate() { 
    console.log("Creating template...");
}

emailBody.addEventListener("input", updateSavedKeywords);
// createTemplateButton.addEventListener("click", createTemplate);
setKeywordTypes();