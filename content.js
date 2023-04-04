// Remove articles when the page loads
console.log("injected");

let forbiddenWords = []

chrome.runtime.sendMessage({ action: 'getKeywords' }, (keywords) => {
    console.log("sent runtime message getKeywords");
    forbiddenWords = keywords
    console.log("removed articles on pageload")
    removeArticles(document.querySelectorAll('article'));
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("received updated keywords")
    if (request.type === "KEYWORDS_RECEIVED") {
        var keywords = request.keywords;
        console.log("Received keywords in content.js:", keywords);
        forbiddenWords = keywords

        // TODO: recheck all already loaded articles... (& reload page?)
    }
});

function removeArticles(articles) {
    // console.log("called removeArticles! Checking for the following keywords:");
    // console.log(forbiddenWords)

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
                    console.log("removed article:")
                    console.log(link.title)
                    article.remove()
                    // TODO: instead of removing them, maybe hide them?
                    // TODO: sometimes doesnt work? but works when using search? at least for the first few entries... (maybe an issue with the MutationObserver)
                }
            } else {
                console.log("clear title: " + title)
            }
        }
    }
}

// Remove articles when new ones are added dynamically
const observer = new MutationObserver(function (mutations) {
    try {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length > 0) {
                const articles = Array.from(mutation.addedNodes)
                    .flatMap(node => node.querySelectorAll('article'));
                removeArticles(articles);
                // console.log("checked new data...")
            }
        });
    } catch {
        
    }

});

observer.observe(document, { childList: true, subtree: true });

/* chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("Received message!")
    if (request.action === 'getKeywords') {
        sendResponse({ keywords: forbiddenWords });
    } else if (request.action === 'addKeyword') {
        forbiddenWords.push(request.keyword);
    } else if (request.action === 'removeKeyword') {
        const index = forbiddenWords.indexOf(request.keyword);
        if (index !== -1) {
            forbiddenWords.splice(index, 1);
        }
    }
}); */

