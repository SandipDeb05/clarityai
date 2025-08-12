export async function fetchGeminiAIResponse(question: string, tabText: string) {
  if (!question || !tabText) return;
  const limitedTabText: string = tabText
    ?.split(/\s+/)
    ?.slice(0, 100)
    ?.join(" ");

  const prompt: string = `
  You are ClarityAI, an intelligent assistant built into a Chrome extension. Your goal is to provide the most relevant and accurate answer to the user's query.
  The user has asked the following question: "${question}"
  The content of the current web page (limited to ~100 words): "${limitedTabText}"
  Using only the provided page content, generate a clear, accurate, and helpful answer to the user's query.
  Instructions:
 1. If the question can be answered without page content (e.g., general knowledge like "2+2"), answer directly.
 2. If the question relates to the current page, prioritize using the page content for accuracy.
 3. Keep the answer under 60 words.
 4. Make it concise, clear, and directly answer the question.
 5. Output plain text only — no formatting, quotes, markdown, or extra characters.
 6. Avoid speculation or filler; be factual and relevant.
 Avoid filler language or speculation. Prioritize clarity and relevance.`;

  const response: Response = await fetch(
    "https://clarity-ai-proxy.sandip-ai-proxy.workers.dev",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    }
  );

  const data = await response.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text || "Something went wrong"
  );
}
