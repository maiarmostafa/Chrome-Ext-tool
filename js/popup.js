//document.querySelector("#copy-btn").addEventListener("click", copy);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "pData") {
            chrome.storage.local.get(['data'], function(result) {
                document.querySelector("#acc-name").textContent = result.data[0]
            });
        }
    }
);


function copyFunction(tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "copy" });
        /*, function(response) {

            console.log("pop up - in in in function")
            console.log(tabs)
            console.log(tabs[0])
            console.log(tabs[0].id)
            console.log(response)
            console.log(response.farewell);
        }*/
    });
}


function pasteFunction(tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "paste" });
        /*, function(response) {

            console.log("pop up - in in in function")
            console.log(tabs)
            console.log(tabs[0])
            console.log(tabs[0].id)
            console.log(response)
            console.log(response.farewell);
        }*/
    });
}

chrome.storage.local.get(['data'], function(result) {
    document.querySelector("#acc-name").innerText = result.data[0]
});
console.log(document.querySelector("#copy-btn"))
document.querySelector("#copy-btn").addEventListener("click", copyFunction)
document.querySelector("#paste-btn").addEventListener("click", pasteFunction)