import { useState } from "react";
import { fetchGeminiAIResponse } from "../api/geminiAI";
import "./popup.css";

function App() {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleTask = async () => {
    if (!question?.trim()) return;
    setLoading(true);
    setResponse("");
    chrome.runtime.sendMessage(
      { action: "FETCH_TAB_TEXT" },
      async (response) => {
        try {
          const tabText: string = response.text;
          const answer: string = await fetchGeminiAIResponse(question, tabText);
          setResponse(answer);
        } catch (e: unknown) {
          setResponse("An error occurred. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const handleClosePopup = () => {
    window.close();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") handleTask();
    return;
  };

  return (
    <main className="main__container">
      <div className="heading__wrapper">
        <h2 className="heading">ClarityAI: Your Web assistant</h2>
        <div role="button" className="close__btn" onClick={handleClosePopup}>
          &times;
        </div>
      </div>

      <textarea
        name="question"
        className="question__popup"
        placeholder="What's on your mind?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <button onClick={handleTask}>
        {loading ? "Loading..." : "Get Clarity"}
      </button>

      {loading && <p className="loading__text">Analyzing...</p>}

      {response && (
        <div className="response__wrapper">
          <h3 className="response__title">ClarityAI Insight</h3>
          <div className="response__popup">{response}</div>
        </div>
      )}
    </main>
  );
}

export default App;
