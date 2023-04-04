// set focus to text input, for better usability
document.getElementById("keywordInput").focus()
updateKeywordsList();
updateOptions();

const hideImagesCheckbox = document.getElementById('hide-images-checkbox');
const hidePreviewCheckbox = document.getElementById('hide-preview-checkbox');

function updateOptions() {
    chrome.runtime.sendMessage({ action: 'getOptions' }, (options) => {

        if (options && options.length > 0) {
            console.log("CJAIJAUSHIUASHIUHADS")
            hideImagesCheckbox.checked = options[0];
            console.log("set checkbox to : " + options[0])
            hidePreviewCheckbox.checked = !options[1];
            console.log("updated state of input-boxes")
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

    const $myInput = document.getElementById('keywordInput');

    $myInput.onkeydown = function (event) {
        const newKeyword = $myInput.value
        if (event.key === 'Enter') {
            if (newKeyword) {
                chrome.runtime.sendMessage(
                    { action: 'addKeyword', keyword: newKeyword },
                    () => {
                        updateKeywordsList();
                    }
                );
                $myInput.value = ""
            }
        }
    }

    addKeywordButton.addEventListener('click', () => {
        const newKeyword = $myInput.value
        if (newKeyword) {
            chrome.runtime.sendMessage(
                { action: 'addKeyword', keyword: newKeyword },
                () => {
                    updateKeywordsList();
                }
            );
            $myInput.value = ""
        }
    });

    // Define a variable to store the state of the checkbox
    let hideImages = true;

    // Retrieve the value of 'hideImages' from Chrome storage
    chrome.storage.local.get('hideImages', ({ hideImages: storedHideImages = true }) => {
        // Update the state of the checkbox based on the retrieved value
        hideImagesCheckbox.checked = storedHideImages;
        // Update the local variable with the retrieved value
        hideImages = storedHideImages;
    });

// Add an event listener for 'click' event on the checkbox
    hideImagesCheckbox.addEventListener('click', () => {
        // Update the value of 'hideImages' to the opposite of its current value
        hideImages = !hideImages;
        // Set the updated value of 'hideImages' to Chrome storage
        chrome.storage.local.set({ hideImages }, () => {
            // Callback function after setting the value in Chrome storage
        });

        // Send a message to the background script with the updated options
        chrome.runtime.sendMessage({ action: 'setOptions', options: [hideImages, false] });
    });


    /*
        // WORKS LIKE THIS
        chrome.storage.local.get('hidePreview', ({ hidePreview = false }) => {
            hidePreviewCheckbox.checked = hidePreview;
    
            hidePreviewCheckbox.addEventListener('click', () => {
                const newHidePreview = !hidePreviewCheckbox.checked;
                chrome.storage.local.set({ hidePreview: newHidePreview }, () => {
                });
                chrome.runtime.sendMessage(
                    { action: 'setOptions', options: [false, newHidePreview] },
                );
            });
        }); */
});