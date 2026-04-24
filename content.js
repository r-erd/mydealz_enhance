// Remove articles when the page loads
console.debug("injected content.js mydealz_enhance");
const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
chrome.runtime.sendMessage({ action: 'setColorScheme', isDark: colorSchemeQuery.matches });
colorSchemeQuery.addEventListener('change', (e) => {
    chrome.runtime.sendMessage({ action: 'setColorScheme', isDark: e.matches });
});
let forbiddenWords = []
let filterEnabled = true

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

    try {
        const activeClass = input ? '' : ' filtered-toggle--off';
        const filteredHint = `<li style="display:flex;align-items:center;padding:0 8px;" class="subNavMenu-item--separator cept-sort-tab"><span class="filtered-hint">Keyword filter<span class="filtered-toggle${activeClass}"><span class="filtered-toggle-track"></span></span></span></li>`;

        document.querySelectorAll(".subNavMenu-list").forEach(ul => ul.insertAdjacentHTML('beforeend', filteredHint));

        document.querySelectorAll('.filtered-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const newState = !userFilterEnable;
                chrome.storage.local.set({ disableFilter: newState });
                chrome.storage.local.get(['options'], (result) => {
                    const options = result.options || [false, false, false, false, false];
                    options[4] = newState;
                    chrome.storage.local.set({ options }, () => window.location.reload());
                });
            });
        });
    } catch {
        filterEnabled = false
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

const observer = new MutationObserver(removeArticles);
observer.observe(document.body, { childList: true, subtree: true });
