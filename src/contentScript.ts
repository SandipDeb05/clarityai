/// <reference types="chrome"/>

import { Readability } from "@mozilla/readability";
import { stopwords } from "./constants/utils";

function getMainPageText(limitWords: number = 100) {
  const docClone = document.cloneNode(true) as Document;
  const article = new Readability(docClone).parse();
  const text = article?.textContent?.trim() || document.body.innerText.trim();

  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);

  const scored = sentences.map((sentence, index) => {
    const words = sentence.toLowerCase().split(/\W+/);
    const keywordCount = words.filter((w) => w && !stopwords.has(w)).length;
    const score = keywordCount + (sentences.length - index) * 0.1;
    return { sentence, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const selected: string[] = [];
  let wordCount = 0;
  for (const { sentence } of scored) {
    const wordsInSentence = sentence.split(/\s+/).length;
    if (wordCount + wordsInSentence > limitWords) break;
    selected.push(sentence);
    wordCount += wordsInSentence;
  }

  return (article?.title ? article.title + ". " : "") + selected.join(" ");
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "GET_PAGE_TEXT") {
    const mainText = getMainPageText(250);
    sendResponse({ text: mainText });
  }
});
