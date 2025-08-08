export async function fetchGeminiAIResponse(question: string, tabText: string) {
  if (!question || !tabText) return;
  const limitedTabText: string = tabText
    ?.split(/\s+/)
    ?.slice(0, 100)
    ?.join(" ");

  const prompt: string = `
  You are ClarityAI, an intelligent assistant built into a Chrome extension. Your role is to help users understand or extract insights from the current webpage they are viewing.
  The user has asked the following question: "${question}"
  The content of the current web page is: "${limitedTabText}"
  Using only the provided page content, generate a clear, accurate, and helpful answer to the user's query. Do not make assumptions or include information not explicitly stated in the content.
  Your response must be:
  1. Under 60 words strictly.
  2. Concise and easy to understand.
  3. Focused strictly on the context of the tab.
  4. Output plain text only — no formatting, quotes, markdown, or extra characters.
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
