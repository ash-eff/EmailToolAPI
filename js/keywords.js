import {keywordsSavedList,
    emailBody,
    keywordName,
    keywordTypes,
    keywordOptions,
    keywordOptionsContainer,
 } from './dom.js';

class Keyword {
    constructor(name, type, options = [], description = "") {
        this.name = name;
        this.type = type;
        this.options = options;
        this.description = description;
    }
}

export const keywords = new Map();
export const removedKeywords = new Map();

export function updateKeywordsSavedList() {
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
        hideKeywordTypes(keywordOptionsContainer);
    }
    else {
        resetKeywordForm();
    }
}

export function populateSavedKeywords(originalKeywords) {
    originalKeywords.forEach(keyword => {
        keywords.set(keyword.name, keyword);
    });
    updateKeywordsSavedList(); 
}

export function updateKeywordOptionsList() {
    let currentKeyword = keywords.get(keywordName.value);
    let options = keywordOptions.value.split(/,|\n/).map(option => option.trim());
    options = options.filter(option => option !== "");
    currentKeyword.options = options; 
}

export async function saveKeywords(keywords) {
    let keywordList = [];

    for (let keyword of keywords.values()) {
        if (keyword.name !== "") {
            let response, data;

            const newKeyword = {
                name: keyword.name,
                type: keyword.type,
                options: keyword.options
            };

            response = await fetch("http://localhost:8000/keywords/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newKeyword)
            });

            if (!response.ok) {
                throw new Error(`Failed to save keyword: ${keyword.name}`);
            }

            data = await response.json();
            keywordList.push(data);
        }
    }

    return keywordList;
}

export async function updateKeywords(keywords) {
    const keywordList = [];

    for (let keyword of keywords.values()) {
        if (keyword.name !== "") {
            let response, data;

            if (keyword.id === undefined) {
                response = await fetch("http://localhost:8000/keywords/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(keyword)
                });
            } else {
                response = await fetch(`http://localhost:8000/keywords/${keyword.id}/`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(keyword)
                });
            }

            if (!response.ok) {
                throw new Error(`Failed to ${keyword.id === undefined ? 'create' : 'update'} keyword: ${keyword.name}`);
            }

            data = await response.json();
            keyword.id = data.id;
            keywordList.push(data);
        } else {
            console.warn("Skipping keyword with empty name:", keyword);
        }
    }

    return keywordList;
}

export async function deleteKeywords(keywords) {
    for (let keyword of keywords.values()) {
        if (keyword.id !== undefined) {
            fetch(`http://localhost:8000/keywords/${keyword.id}/`, {
                method: "DELETE"
            });
        }
    }
}

export async function setKeywordTypes() {
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
                handleKeywordTypeClick(type, keywordName);
            });
        });
    } catch (error) {
        console.error('Error fetching types:', error);
    }
}

function handleSavedKeywordClick(keyword) {
    updateKeywordName(keyword);
    updateKeywordType(keywords.get(keyword).type);
    updateKeywordOptions(keywords.get(keyword).options);
    hideKeywordTypes();
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

export function resetKeywordForm() {
    clearKeywords();
    updateKeywordName("");
    updateKeywordType("Input Field");
    clearKeywordOptions();
    hideKeywordTypes();
}

export function hideKeywordTypes() {
    if (keywordTypes.value === "Dropdown Menu") {
        keywordOptionsContainer.classList.remove("hidden");
        keywordOptionsContainer.classList.add("visible");
    }
    else {
        keywordOptionsContainer.classList.remove("visible");
        keywordOptionsContainer.classList.add("hidden");
    }
}

export function handleKeywordTypeClick(type, keywordName) {
    hideKeywordTypes();
    let keyword = keywords.get(keywordName.value);
    keyword.type = type;
}

export function clearKeywordOptions() {
    keywordOptions.value = "";
}

export function clearRemovedKeywords() {
    removedKeywords.clear();
}

export function clearKeywordList() {
    keywordsSavedList.innerHTML = '';
}

function clearKeywords() {
    keywords.clear();
}
