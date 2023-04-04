// Remove articles when the page loads
console.log("injected");
let forbiddenWords = []

chrome.runtime.sendMessage({ action: 'getKeywords' }, (keywords) => {
    console.log("sent runtime message getKeywords");
    forbiddenWords = keywords
    console.log("removed articles on pageload")
    filterArticles()
});

chrome.runtime.sendMessage({ action: 'getOptions' }, (options) => {
    console.log("sent runtime message getOptions");
    hideImages(request.options[0])
    hideUserHtml(request.options[1])
    console.log("removed images on pageload")
});


function hideImages(hideImages) {
    const main = document.querySelector('main');

    if (!hideImages) {
        main.classList.add('hide-threadGrid-image');
        console.log("hiding images")
    } else {
        main.classList.remove('hide-threadGrid-image');
        console.log("unhiding images")
    }
}

function hideUserHtml(input) {
    const main = document.querySelector('main');

    if (input) {
        main.classList.add('hide-userHtml');
        console.log("hiding UserHtml")
    } else {
        main.classList.remove('hide-userHtml');
        console.log("unhiding UserHtml")
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.type === "KEYWORDS_RECEIVED") {
        console.log(request.keywords)
        var keywords = request.keywords;
        forbiddenWords = keywords
        filterArticles()
    }

    if (request.type == 'OPTIONS_RECEIVED') {
        console.log(request.options);
        hideImages(request.options[0])
        hideUserHtml(request.options[1])
        //TODO: implement other options etc
    }
});

function filterArticles() {
    removeArticles(document.querySelectorAll('article'));
}

function removeArticles(articles) {
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
                    console.log("removed article: " + link.title)
                    article.remove()
                }
            } else {
                console.log("clear title: " + title)
            }
        }
    }
}

const observer = new MutationObserver(filterArticles);
observer.observe(document.body, { childList: true, subtree: true });
