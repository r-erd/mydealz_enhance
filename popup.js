// set focus to text input, for better usability
document.getElementById("keywordInput").focus()
updateKeywordsList();
updateOptions();

const hideImagesCheckbox = document.getElementById('hide-images-checkbox');
const disableFilterCheckbox = document.getElementById('disable-filter-checkbox');
const hideCategoriesCheckbox = document.getElementById('hide-categories-checkbox');
const removeColorsCheckbox = document.getElementById('remove-colors-checkbox');
const hideSidebarCheckbox = document.getElementById('hide-sidebar-checkbox');

function updateOptions() {
    chrome.runtime.sendMessage({ action: 'getOptions' }, (options) => {

        if (options && options.length > 0) {
            hideImagesCheckbox.checked = options[0];
            disableFilterCheckbox.checked = options[1];
            hideCategoriesCheckbox.checked = options[2];
            removeColorsCheckbox.checked = options[3];
            disableFilterCheckbox.checked = options[4];
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

    const exportKeywordsButton = document.getElementById('export-keywords-button');
    exportKeywordsButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'getKeywords' }, (keywords) => {
            const jsonData = JSON.stringify(keywords, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `mydealz_keywords_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
        });
    });

    const importKeywordsButton = document.getElementById('import-keywords-button');
    const importFileInput = document.getElementById('import-file-input');

    importKeywordsButton.addEventListener('click', () => {
        importFileInput.click();
    });

    importFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);

                if (!Array.isArray(importedData)) {
                    alert('Error: JSON file must contain an array of keywords');
                    return;
                }

                if (!importedData.every(item => typeof item === 'string')) {
                    alert('Error: All items in the array must be strings');
                    return;
                }

                chrome.runtime.sendMessage({ action: 'getKeywords' }, (existingKeywords) => {
                    const merged = Array.from(new Set([...existingKeywords, ...importedData]));
                    const newCount = merged.length - existingKeywords.length;

                    chrome.runtime.sendMessage(
                        { action: 'setKeywords', keywords: merged },
                        () => {
                            updateKeywordsList();
                            alert(`Import successful! Added ${newCount} new keyword(s). Total: ${merged.length}`);
                        }
                    );
                });
            } catch (error) {
                alert(`Error reading file: ${error.message}`);
            }
        };
        reader.readAsText(file);
        importFileInput.value = '';
    });

    // GET MOST RECENT STATE
    let hideImages = true;
    let hidePreview = true;
    let hideCategories = true;
    let removeColors = true;
    let hideSidebar = false;
    let disableFilter = false;

    chrome.storage.local.get('hideImages', ({ hideImages: storedHideImages = true }) => {
        hideImagesCheckbox.checked = storedHideImages;
        hideImages = storedHideImages;
    });

    chrome.storage.local.get('disableFilter', ({ disableFilter: storedDisableFilter = true }) => {
        disableFilterCheckbox.checked = storedDisableFilter;
        disableFilter = storedDisableFilter;
        var element = document.getElementById("keywordComponent");
        if (disableFilter) {
            element.style.display = "block";
            console.log("showing keywords")
        } else {
            element.style.display = "none";
            console.log("hiding keywords")
        }
    });

    chrome.storage.local.get('hideCategories', ({ hideCategories: storedHideCategories = true }) => {
        hideCategoriesCheckbox.checked = storedHideCategories;
        hideCategories = storedHideCategories;
    });

    chrome.storage.local.get('removeColors', ({ removeColors: storedRemoveColors = true }) => {
        removeColorsCheckbox.checked = storedRemoveColors;
        removeColors = storedRemoveColors;
    });

    chrome.storage.local.get('hideSidebar', ({ hideSidebar: storedHideSidebar = false }) => {
        hideSidebarCheckbox.checked = storedHideSidebar;
        hideSidebar = storedHideSidebar;
    });

    // LISTEN AND UPDATE STATE
    hideImagesCheckbox.addEventListener('click', () => {
        hideImages = !hideImages;
        chrome.storage.local.set({ hideImages }, () => { });
        chrome.runtime.sendMessage({ action: 'setOptions', options: [hideImages, hidePreview, hideCategories, removeColors, disableFilter] });
    });

    disableFilterCheckbox.addEventListener('click', () => {
        disableFilter = !disableFilter;
        chrome.storage.local.set({ disableFilter }, () => { });
        chrome.runtime.sendMessage({ action: 'setOptions', options: [hideImages, hidePreview, hideCategories, removeColors, disableFilter] });

        var element = document.getElementById("keywordComponent");
        if (disableFilter) {
            element.style.display = "block";
            console.log("showing keywords2")
        } else {
            element.style.display = "none";
            console.log("hiding keywords2")
        }
    });

    hideCategoriesCheckbox.addEventListener('click', () => {
        hideCategories = !hideCategories;
        chrome.storage.local.set({ hideCategories }, () => { });
        chrome.runtime.sendMessage({ action: 'setOptions', options: [hideImages, hidePreview, hideCategories, removeColors, disableFilter] });
    });

    removeColorsCheckbox.addEventListener('click', () => {
        removeColors = !removeColors;
        chrome.storage.local.set({ removeColors }, () => { });
        chrome.runtime.sendMessage({ action: 'setOptions', options: [hideImages, hidePreview, hideCategories, removeColors, disableFilter] });
    });

    hideSidebarCheckbox.addEventListener('click', () => {
        hideSidebar = !hideSidebar;
        chrome.storage.local.set({ hideSidebar }, () => { });
        chrome.runtime.sendMessage({ action: 'setSidebar', hideSidebar });
    });

    // UNHIDE ALL THREADS
    const unhideThreadsButton = document.getElementById('unhide-threads-button');
    unhideThreadsButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'unhideAllThreads' }, () => {
            console.log('All threads unhidden');
        });
    });
});