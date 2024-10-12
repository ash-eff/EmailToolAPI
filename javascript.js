const emailBody = document.getElementById("email-body");
const savedKeywordsList = document.getElementById("saved-keywords-list");
const keywordName = document.getElementById("keyword-name");
const keywordValue = document.getElementById("keyword-value");
// const updateKeywordButton = document.getElementById("update-keyword-button");
// const removeKeywordButton = document.getElementById("remove-keyword-button");
const createTemplateButton = document.getElementById("create-template-button");
const swapToCreateKeywordButton = document.getElementById("swap-to-create-keyword-button");
const swapToEditTemplateButton = document.getElementById("swap-to-edit-template-button");
const rightForm = document.getElementById("right-form");

const keywords = new Map();

function updateSavedKeywords() {
    console.log(keywords.size);
    savedKeywordsList.innerHTML = '';

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
        const li = document.createElement("li");
        li.textContent = keyword;
        li.classList.add("keyword-item"); 
    
        li.addEventListener("click", () => {
            handleKeywordClick(keyword);
        });
    
        savedKeywordsList.appendChild(li);
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

function loadRightFormContent() {
    fetch('right-forms.html')
        .then(response => response.text())
        .then(data => {
            rightForm.innerHTML = data;
            document.getElementById("update-keyword-button").addEventListener("click", updateKeyword);
            document.getElementById("remove-keyword-button").addEventListener("click", removeKeyword);
            document.getElementById("add-keyword-button").addEventListener("click", addKeyword);
        });
}

function swapToCreateForm() {
    document.getElementById("edit-template-keywords").style.display = "none";
    document.getElementById("create-template-keywords").style.display = "block";
    swapToCreateFormButton.style.display = "none";
    swapToKeywordFormButton.style.display = "inline-block";
}

function swapToKeywordForm() {
    document.getElementById("edit-template-keywords").style.display = "block";
    document.getElementById("create-template-keywords").style.display = "none";
    swapToCreateFormButton.style.display = "inline-block";
    swapToKeywordFormButton.style.display = "none";
}

emailBody.addEventListener("input", updateSavedKeywords);
createTemplateButton.addEventListener("click", createTemplate);
swapToCreateKeywordButton.addEventListener("click", swapToCreateForm);
swapToEditTemplateButton.addEventListener("click", swapToKeywordForm);


loadRightFormContent();