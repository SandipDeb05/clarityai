import { useState } from "react";
import { fetchGeminiAIResponse } from "../api/geminiAI";
import "./popup.css";

function App() {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [typeOfSearch, setTypeOfSearch] = useState<string>("ask_anything");

  const handleTask = async () => {
    if (!question?.trim()) return;
    setLoading(true);
    setResponse("");

    switch (typeOfSearch) {
      case "ask_anything": {
        try {
          const answer = await fetchGeminiAIResponse(question, "", {
            queryType: "ask_anything",
          });
          setResponse(answer);
        } catch (e) {
          setResponse("An error occurred. Please try again.");
        } finally {
          setLoading(false);
        }
        return;
      }
      case "disctonary": {
        try {
          const answer = await fetchGeminiAIResponse(question, "", {
            queryType: "disctonary",
          });
          setResponse(answer);
        } catch (e) {
          setResponse("An error occurred. Please try again.");
        } finally {
          setLoading(false);
        }
        return;
      }
      case "whole_page_search": {
        chrome.runtime.sendMessage(
          { action: "FETCH_TAB_TEXT" },
          async (response) => {
            try {
              const tabText: string = response.text;
              const answer: string = await fetchGeminiAIResponse(
                question,
                tabText,
                { queryType: "whole_page_search" }
              );
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
        <h2 className="heading poppins-bold">ClarityAI</h2>
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
          Type
        </label>
        <select id="type" className="select" onChange={handleTypeChange}>
          <option value="ask_anything">Ask anything</option>
          <option value="disctonary">Disctonary</option>
          <option value="whole_page_search">Whole page search</option>
          {/* <option value="ask_about_section">Ask about a section</option> */}
          {/* <option value="web_search">Web search</option> */}
        </select>
      </div>

      <button onClick={handleTask}>{loading ? "Loading..." : "ASK"}</button>

      {loading && (
        <div className="loading-skeleton">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
      )}

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
