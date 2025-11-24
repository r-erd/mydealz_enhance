// Remove articles when the page loads
console.debug("injected content.js mydealz_enhance");
let forbiddenWords = []
let filterEnabled = true
let hiddenThreads = []

chrome.runtime.sendMessage({ action: 'getKeywords' }, (keywords) => {
    console.debug("sent initial getKeywords");
    forbiddenWords = keywords
    removeArticles()
    console.debug("removed images on pageload")
});

let userFilterEnable = false
chrome.runtime.sendMessage({ action: 'getOptions' }, (options) => {
    console.debug("sent initial getOptions");
    console.log(options)
    hideImages(options[0])
    hideUserHtml(options[1])
    hideCategories(options[2])
    enableGreyscale(options[3])
    enableFiltering(options[4])
    console.debug("set options on pageload")

});

let hideSidebarEnabled = false
chrome.storage.local.get('hideSidebar', ({ hideSidebar: storedHideSidebar = false }) => {
    console.debug("loaded hideSidebar setting: " + storedHideSidebar);
    hideSidebarEnabled = storedHideSidebar;
    hideSidebar(hideSidebarEnabled);
});

// Load hidden threads on page load
chrome.runtime.sendMessage({ action: 'getHiddenThreads' }, (threads) => {
    console.debug("sent initial getHiddenThreads");
    hiddenThreads = threads || []
    hideThreadsByIds()
    injectHideButtons()
    console.debug("applied hidden threads on pageload")
});


function hideImages(input) {
    const main = document.querySelector('main');

    if (input) {
        main.classList.add('hide-threadGrid-image');
        console.debug("hiding images")
    } else {
        main.classList.remove('hide-threadGrid-image');
        console.debug("showing images")
    }
}

function hideUserHtml(input) {
    const main = document.querySelector('main');

    if (input) {
        main.classList.add('hide-userHtml');
        console.debug("hiding UserHtml")
    } else {
        main.classList.remove('hide-userHtml');
        console.debug("showing UserHtml")
    }
}

function hideCategories(input) {
    const main = document.querySelector('main');

    if (input) {
        main.classList.add('hide-groupPromo--bg');
        console.debug("hiding categories")
    } else {
        main.classList.remove('hide-groupPromo--bg');
        console.debug("showing categories")
    }
}

function hideSidebar(input) {
    const main = document.querySelector('main');

    if (input) {
        main.classList.add('hide-sidebar');
        console.debug("hiding sidebar")
    } else {
        main.classList.remove('hide-sidebar');
        console.debug("showing sidebar")
    }
}

function enableGreyscale(input) {
    const body = document.body;

    if (input) {
        body.classList.add('greyscale');
        console.debug("enabled greyscale")
    } else {
        body.classList.remove('greyscale');
        console.debug("disabled greyscale")
    }
}

function enableFiltering(input) {
    userFilterEnable = input

    if (userFilterEnable) {
        try {
            // add hint that the threadList is filtered
            let inner = '🐊 Filtered'
            let child = '<a style="height: 30px;" <span class="filtered-hint">' + inner + ' </span></a>'
            let filteredHint = '<li style="height: 3.25062em; display: flex; align-items: center;" class="subNavMenu-item--separator cept-sort-tab">' + child + '</li>';

            document.querySelectorAll(".subNavMenu-list").forEach(ul => ul.insertAdjacentHTML('beforeend', filteredHint));
        } catch {
            filterEnabled = false
        }
    }
}

// Hide threads based on hiddenThreads array
function hideThreadsByIds() {
    hiddenThreads.forEach(threadId => {
        const article = document.getElementById(`thread_${threadId}`);
        if (article) {
            article.style.display = 'none';
            console.debug(`hiding thread ${threadId}`)
        }
    });
}

// Inject "Hide 🙈" buttons into thread articles
function injectHideButtons() {
    const articles = document.querySelectorAll('article[id^="thread_"]');
    articles.forEach(article => {
        // Check if button already exists
        if (article.querySelector('.hide-thread-btn')) return;

        const threadId = article.id.replace('thread_', '');
        const actionContainer = article.querySelector('.threadListCard-header-action');

        if (actionContainer) {
            const hideButton = document.createElement('button');
            hideButton.className = 'hide-thread-btn';
            hideButton.textContent = 'Hide 🙈';
            hideButton.title = 'Hide this thread';
            hideButton.style.cssText = 'margin-left: 10px; padding: 5px 10px; border: 1px solid #ccc; border-radius: 5px; cursor: pointer; background: white;';

            hideButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                hideThread(threadId);
            });

            actionContainer.appendChild(hideButton);
        }
    });
}

// Hide a specific thread and add its ID to the blacklist
function hideThread(threadId) {
    // Add to hiddenThreads array
    if (!hiddenThreads.includes(threadId)) {
        hiddenThreads.push(threadId);
        // Save to storage via background.js
        chrome.runtime.sendMessage({
            action: 'addHiddenThread',
            threadId: threadId
        });
        console.debug(`added thread ${threadId} to blacklist`)
    }

    // Hide the article
    const article = document.getElementById(`thread_${threadId}`);
    if (article) {
        article.style.display = 'none';
        console.debug(`hid thread ${threadId}`)
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.type === "KEYWORDS_RECEIVED") {
        console.debug("received keywords: " + request.keywords)
        var keywords = request.keywords;
        forbiddenWords = keywords
        removeArticles()
    }

    if (request.type == 'OPTIONS_RECEIVED') {
        console.debug("received options: " + request.options);
        hideImages(request.options[0])
        hideUserHtml(request.options[1])
        hideCategories(request.options[2])
        enableGreyscale(request.options[3])
    }

    if (request.action == 'setSidebar') {
        console.debug("received setSidebar: " + request.hideSidebar);
        hideSidebarEnabled = request.hideSidebar;
        hideSidebar(hideSidebarEnabled);
    }

    if (request.type === 'HIDDEN_THREADS_RECEIVED') {
        console.debug("received hidden threads: " + request.threads);
        hiddenThreads = request.threads || [];
        hideThreadsByIds();
    }

    if (request.type === 'UNHIDE_ALL_THREADS') {
        console.debug("unhiding all threads");
        hiddenThreads = [];
        // Show all hidden threads
        document.querySelectorAll('article[id^="thread_"]').forEach(article => {
            article.style.display = '';
        });
    }
});

function removeArticles() {
    if (filterEnabled && userFilterEnable) {
        let articles = document.querySelectorAll('article')
        for (let article of articles) {
            // Check if article is a valid DOM element
            if (article.nodeType !== Node.ELEMENT_NODE) {
                continue;
            }

            const links = article.querySelectorAll('a[title]');
            for (let link of links) {
                const title = link.getAttribute('title');

                if (forbiddenWords.some(word => title.toLowerCase().includes(word.toLowerCase()))) {
                    // Check if the ancestor of the link element with a class of "threadGrid" exists
                    const threadGrid = link.closest('.thread');
                    if (threadGrid) {
                        // Remove the article element that contains the threadGrid element
                        const article = threadGrid.closest('article');
                        console.info("removed article: " + title)
                        article.remove()
                    }
                } else {
                }
            }
        }
    }
}

const observer = new MutationObserver(() => {
    removeArticles();
    injectHideButtons();
    hideThreadsByIds();
});
observer.observe(document.body, { childList: true, subtree: true });
