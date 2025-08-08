/// <reference types="chrome"/>

import { Readability } from "@mozilla/readability";

function getMainPageText() {
  const docClone = document.cloneNode(true) as Document;
  const article = new Readability(docClone).parse();
  return article?.textContent?.trim() || document.body.innerText.trim();
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "GET_PAGE_TEXT") {
    const mainText = getMainPageText();
    sendResponse({ text: mainText });
  }
});
