chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ keywords: [] });
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == 'getKeywords') {
        console.log("background.js responded with keywords")
        chrome.storage.local.get(['keywords'], function (result) {
            sendResponse(result.keywords);
        });
    }
    if (request.action == 'setKeywords') {
        console.log("background.js set the keywords")
        chrome.storage.local.set({ keywords: request.keywords }, function () {
            sendResponse(true);
        });
    }
    if (request.action == 'addKeyword') {
        console.log("background.js added a keywords")
        chrome.storage.local.get(['keywords'], function (result) {
            const keywords = result.keywords || [];
            keywords.push(request.keyword);
            chrome.storage.local.set({ keywords }, function () {
                sendResponse(true);
            });
        });
    }
    if (request.action == 'removeKeyword') {
        console.log("background.js removed a keywords")
        chrome.storage.local.get(['keywords'], function (result) {
            const keywords = result.keywords || [];
            const index = keywords.indexOf(request.keyword);
            if (index > -1) {
                keywords.splice(index, 1);
                chrome.storage.local.set({ keywords }, function () {
                    sendResponse(true);
                });
            }
        });
    }

    // Forward the message to content.js
    chrome.storage.local.get(['keywords'], function (result) {
        console.log("Forwarding to content.js...")
        // Send the keywords to content.js
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "KEYWORDS_RECEIVED", keywords: result.keywords });
        });
    });

    return true
});
