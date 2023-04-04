// Remove articles when the page loads
console.log("injected");

let forbiddenWords = []

chrome.runtime.sendMessage({ action: 'getKeywords' }, (keywords) => {
    console.log("sent runtime message getKeywords");
    forbiddenWords = keywords
    console.log("removed articles on pageload")
    filterArticles()
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

function filterArticles() {
    removeArticles(document.querySelectorAll('article'));
}

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
                }
            } else {
                console.log("clear title: " + title)
            }
        }
    }
}

const observer = new MutationObserver(filterArticles);
observer.observe(document.body, { childList: true, subtree: true });
