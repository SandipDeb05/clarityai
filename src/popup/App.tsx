import { useState } from "react";
import { fetchGeminiAIResponse } from "../api/geminiAI";
import "./popup.css";

function App() {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [typeOfSearch, setTypeOfSearch] = useState<string>("General Search");
  const [error, setError] = useState<string>("");

  const handleTask = async () => {
    if (!question?.trim()) {
      setResponse("");
      setError("What would you like to search?");
      return;
    }
    setLoading(true);
    setResponse("");
    setError("");

    switch (typeOfSearch) {
      case "General Search": {
        try {
          const answer = await fetchGeminiAIResponse(question, "", {
            queryType: "General Search",
          });
          setResponse(answer);
        } catch (e) {
          setResponse("An error occurred. Please try again.");
        } finally {
          setLoading(false);
        }
        return;
      }
      case "Meaning Explorer": {
        try {
          const answer = await fetchGeminiAIResponse(question, "", {
            queryType: "Meaning Explorer",
          });
          setResponse(answer);
        } catch (e) {
          setResponse("An error occurred. Please try again.");
        } finally {
          setLoading(false);
        }
        return;
      }
      case "Whole Page Search": {
        chrome.runtime.sendMessage(
          { action: "FETCH_TAB_TEXT" },
          async (response) => {
            try {
              const tabText: string = response.text;
              const errorStatus: string | null = response.errorStatus || null;
              const answer: string = await fetchGeminiAIResponse(
                question,
                tabText,
                { queryType: "Whole Page Search" }
              );
              if (errorStatus && errorStatus === "404") {
                setError("Failed to load content from the web.");
              }
              setResponse(answer);
            } catch (e: unknown) {
              setResponse("An error occurred. Please try again.");
            } finally {
              setLoading(false);
            }
          }
        );
        return;
      }
      default:
        return;
    }
  };

  const handleClosePopup = () => {
    window.close();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") handleTask();
    return;
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeOfSearch(e.target.value);
  };

  return (
    <main className="main__container">
      <div className="heading__wrapper">
        <h2 className="heading">
          <span className="text-primary poppins-semibold">ClarityAI:</span>{" "}
          <span className="poppins-medium">{typeOfSearch}</span>
        </h2>
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

      <div className="field">
        <label htmlFor="type" className="field__label">
          📣 Query Type
        </label>
        <select id="type" className="select" onChange={handleTypeChange}>
          <option value="General Search">General Search</option>
          <option value="Meaning Explorer">Meaning Explorer</option>
          <option value="Whole Page Search">Whole Page Search</option>
        </select>
      </div>

      {!question?.trim() && error && <div className="error__msg">{error}</div>}

      <button onClick={handleTask}>
        {loading ? "🤔 Analyzing…" : "Search"}
      </button>

      {loading && (
        <div className="loading-skeleton">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
      )}

      {response && (
        <div className="response__wrapper">
          <h3 className="response__title poppins-medium">
            🤖 ClarityAI Insight
          </h3>
          {question?.trim() && error && (
            <div className="error__msg">{error}</div>
          )}
          <div className="response__popup">{response}</div>
        </div>
      )}
    </main>
  );
}

export default App;
