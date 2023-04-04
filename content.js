// Remove articles when the page loads
console.log("injected");
let forbiddenWords = []

chrome.runtime.sendMessage({ action: 'getKeywords' }, (keywords) => {
    console.log("sent runtime message getKeywords");
    forbiddenWords = keywords
    console.log("removed articles on pageload")
    filterArticles()
});


// FOR TESTING (currently unused)
function hideImages(disableImages) {
    const main = document.querySelector('main');

    if (disableImages) {
        main.classList.add('hide-threadGrid-image');
        console.log("hiding images")
    } else {
        main.classList.remove('hide-threadGrid-image');
        console.log("unihiding images")
    }
}

// FOR TESTING (currently no message is sent)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.hideImages !== undefined) {
        console.log("received updated hideImages")
        const hideImages = message.hideImages;
        console.log(`Hide Images state updated to ${hideImages}`);
        hideImages(hideImages)
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "KEYWORDS_RECEIVED") {
        console.log("received updated keywords")
        var keywords = request.keywords;
        console.log("Received keywords in content.js:", keywords);
        forbiddenWords = keywords
        filterArticles()
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
