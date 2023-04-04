// set focus to text input, for better usability
document.getElementById("keywordInput").focus()

const hideImagesCheckbox = document.getElementById('hide-images-checkbox');

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

    chrome.storage.local.get('hideImages', ({ hideImages = false }) => {
        hideImagesCheckbox.checked = !hideImages;

        hideImagesCheckbox.addEventListener('click', () => {
            const newHideImages = !hideImagesCheckbox.checked;
            chrome.storage.local.set({ hideImages: newHideImages }, () => {
                console.log(`Hide Images value set to ${newHideImages}`);
                //TODO: add code to send message to content.js to add/remove CSS
            });
        });
    });
});