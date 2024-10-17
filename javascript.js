const emailBody = document.getElementById("email-body");
const highlightedArea = document.getElementById('highlighted-text');

const keywordsSavedList = document.getElementById("keywords-saved");
const keywordName = document.getElementById("keyword-name");
const keywordTypes = document.getElementById("keyword-types");
const keywordOptions = document.getElementById("keyword-options");
const keywordOptionsContainer = document.getElementById("keyword-options-container");
const templateTitle = document.getElementById("template-title");

const saveTemplateButton = document.getElementById("save-template-button");

class Keyword {
    constructor(name, type, options = [], description = "") {
        this.name = name;
        this.type = type;
        this.options = options;
        this.description = description;
    }
}

const keywords = new Map();
const removedKeywords = new Map();

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
    // if (templateTitle.value === "") {
    //     alert("Please enter a title for the template.");
    //     return;
    // }

    // if (emailBody.value === "") {
    //     alert("Please enter a body for the email.");
    //     return;
    // }

    // if (keywords.size === 0) {
    //     alert("Please add keywords to the template.");
    //     return;
    // }

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
                console.log(keywordList)
            }
        }

        const template = {
            name: templateTitle.value,
            body: emailBody.value,
            keywords: keywordList
        };

        console.log("Template:", template); 

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

        const templateData = await templateResponse.json();
        console.log("Template saved:", templateData);

    } catch (error) {
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
    }
}

keywordTypes?.addEventListener("input", () => hideKeywordTypes());
emailBody?.addEventListener("input", () => updateKeywordsSavedList());
keywordOptions?.addEventListener("input", () => updateKeywordOptionsList());
saveTemplateButton?.addEventListener("click", () => saveTemplate());

setKeywordTypes();