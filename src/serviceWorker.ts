/// <reference types="chrome"/>

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "FETCH_TAB_TEXT") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) return;
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "GET_PAGE_TEXT" },
        (response) => {
          if (chrome.runtime.lastError) {
            sendResponse({
              text: "Page content unavailable. GEMINI, ignore page context and answer using your general knowledge and reasoning power.",
              errorStatus: "404",
            });
            return;
          }
          sendResponse({ text: response?.text || "", errorStatus: null });
        }
      );
    });
    return true;
  }
});
