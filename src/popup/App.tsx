import { useState } from "react";
import { fetchAIResponse } from "../api/openAI";
import "./popup.css";

function App() {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const handleTask = async () => {
    chrome.runtime.sendMessage(
      { action: "FETCH_TAB_TEXT" },
      async (response) => {
        const tabText = response.text;
        const answer = await fetchAIResponse(question, tabText);
        setResponse(answer);
      }
    );
  };

  return (
    <main className="main__container">
      <h2 className="heading">ClarityAI: Ask your assistant</h2>
      <textarea
        name="question"
        className="question__popup"
        placeholder="Feel free to ask for clarity."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleTask}>Get Clarity</button>

      {response && (
        <div className="response__wrapper">
          <h3 className="response__title">ClarityAI Response</h3>
          <div className="response__popup">{response}</div>
        </div>
      )}
    </main>
  );
}

export default App;
