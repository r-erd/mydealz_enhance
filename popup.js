// set focus to text input, for better usability
document.getElementById("keywordInput").focus()
updateKeywordsList();
updateOptions();

const hideImagesCheckbox = document.getElementById('hide-images-checkbox');
// const hidePreviewCheckbox = document.getElementById('hide-preview-checkbox');
const hideCategoriesCheckbox = document.getElementById('hide-categories-checkbox');
const removeColorsCheckbox = document.getElementById('remove-colors-checkbox');

function updateOptions() {
    chrome.runtime.sendMessage({ action: 'getOptions' }, (options) => {

        if (options && options.length > 0) {
            hideImagesCheckbox.checked = options[0];
            // hidePreviewCheckbox.checked = options[1];
            hideCategoriesCheckbox.checked = options[2];
            removeColorsCheckbox.checked = options[3];
            console.log("updated inital state of input-boxes to: " + options)
        }
    });
}

function updateKeywordsList() {
    chrome.runtime.sendMessage({ action: 'getKeywords' }, (keywords) => {
        const keywordsList = document.getElementById('keywords-list');
        keywordsList.innerHTML = '';

        if (keywords && keywords.length > 0) {
            keywords.forEach((keyword) => {
                
                const button = document.createElement('button');
                button.style = "display: inline; margin-right: 5px; margin-bottom: 5px; border-radius: 10px; padding: 4px; border: 1px solid green; background-color: white; cursor: pointer;"

                button.innerText = keyword;
                button.dataset.keyword = keyword;

                button.addEventListener('click', (event) => {
                    const keywordToRemove = event.target.dataset.keyword;
                    chrome.runtime.sendMessage(
                        { action: 'removeKeyword', keyword: keywordToRemove },
                        () => {
                            updateKeywordsList();
                        }
                    );
                });

           
                keywordsList.appendChild(button);
            });
        } else {
            const li = document.createElement('li');
            const br = document.createElement('br');
            li.innerText = 'No keywords added yet.';
            keywordsList.appendChild(li);
            keywordsList.appendChild(br)
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateKeywordsList();
    updateOptions();

    const addKeywordButton = document.getElementById('add-keyword-button');

    const keywordInput = document.getElementById('keywordInput');

    keywordInput.onkeydown = function (event) {
        const newKeyword = keywordInput.value
        if (event.key === 'Enter') {
            if (newKeyword) {
                chrome.runtime.sendMessage(
                    { action: 'addKeyword', keyword: newKeyword },
                    () => {
                        updateKeywordsList();
                    }
                );
                keywordInput.value = ""
            }
        }
    }

    addKeywordButton.addEventListener('click', () => {
        const newKeyword = keywordInput.value
        if (newKeyword) {
            chrome.runtime.sendMessage(
                { action: 'addKeyword', keyword: newKeyword },
                () => {
                    updateKeywordsList();
                }
            );
            keywordInput.value = ""
        }
    });

    // GET MOST RECENT STATE
    let hideImages = true;
    let hidePreview = true;
    let hideCategories = true;
    let removeColors = true;

    chrome.storage.local.get('hideImages', ({ hideImages: storedHideImages = true }) => {
        hideImagesCheckbox.checked = storedHideImages;
        hideImages = storedHideImages;
    });

/*     chrome.storage.local.get('hidePreview', ({ hidePreview: storedHidePreview = true }) => {
        hidePreviewCheckbox.checked = storedHidePreview;
        hidePreview = storedHidePreview;
    }); */

    chrome.storage.local.get('hideCategories', ({ hideCategories: storedHideCategories = true }) => {
        hideCategoriesCheckbox.checked = storedHideCategories;
        hideCategories = storedHideCategories;
    });

    chrome.storage.local.get('removeColors', ({ removeColors: storedRemoveColors = true }) => {
        removeColorsCheckbox.checked = storedRemoveColors;
        removeColors = storedRemoveColors;
    });

    // LISTEN AND UPDATE STATE
    hideImagesCheckbox.addEventListener('click', () => {
        hideImages = !hideImages;
        chrome.storage.local.set({ hideImages }, () => { });
        chrome.runtime.sendMessage({ action: 'setOptions', options: [hideImages, hidePreview, hideCategories, removeColors] });
    });

/*     hidePreviewCheckbox.addEventListener('click', () => {
        hidePreview = !hidePreview;
        chrome.storage.local.set({ hidePreview }, () => { });
        chrome.runtime.sendMessage({ action: 'setOptions', options: [hideImages, hidePreview, hideCategories, removeColors] });
    }); */

    hideCategoriesCheckbox.addEventListener('click', () => {
        hideCategories = !hideCategories;
        chrome.storage.local.set({ hideCategories }, () => { });
        chrome.runtime.sendMessage({ action: 'setOptions', options: [hideImages, hidePreview, hideCategories, removeColors] });
    });

    removeColorsCheckbox.addEventListener('click', () => {
        removeColors = !removeColors;
        chrome.storage.local.set({ removeColors }, () => { });
        chrome.runtime.sendMessage({ action: 'setOptions', options: [hideImages, hidePreview, hideCategories, removeColors] });
    });

});