export async function fetchOpenAIResponse(question: string, tabText: string) {
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
    `https://api.openai.com/v1/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        message: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    }
  );

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "Something went wrong";
}
