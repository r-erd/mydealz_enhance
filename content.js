// Remove articles when the page loads
console.debug("injected content.js mydealz_enhance");
let forbiddenWords = []

chrome.runtime.sendMessage({ action: 'getKeywords' }, (keywords) => {
    console.debug("sent initial getKeywords");
    forbiddenWords = keywords
    removeArticles()
    console.debug("removed images on pageload")
});

chrome.runtime.sendMessage({ action: 'getOptions' }, (options) => {
    console.debug("sent initial getOptions");
    //BUG: this results in "options is undefined" error beause no response arrives
    if (typeof options != "undefined") {
        hideImages(options.options[0])
        hideUserHtml(options.options[1])
        hideCategories(options.options[2])
        enableGreyscale(options.options[3])
        console.debug("set options on pageload")
    }
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
});

function removeArticles() {
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

const observer = new MutationObserver(removeArticles);
observer.observe(document.body, { childList: true, subtree: true });
