/// <reference types="chrome"/>

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "FETCH_TAB_TEXT") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) return;
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "GET_PAGE_TEXT" },
        (response) => {
          sendResponse({ text: response?.text });
        }
      );
    });
    return true;
  }
});
