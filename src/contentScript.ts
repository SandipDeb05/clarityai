/// <reference types="chrome"/>

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "GET_PAGE_TEXT") {
    const text = document.body.innerText;
    sendResponse({ text: text });
  }
});
