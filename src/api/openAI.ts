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
  Instructions:
  1. If the question can be answered using general knowledge or reasoning, answer directly — do not limit yourself to the page content.
  2. If the question relates to the current page, prioritize using the page content for accuracy.
  3. If the page content is irrelevant or unhelpful, ignore it and answer from general knowledge.
  4. Keep the answer under 60 words, Output in plain text (no formatting, markdown, or quotes).
  5. Make it concise, clear, and directly answer the question.
  Avoid filler language or speculation. Prioritize clarity and relevance.`;

  const response: Response = await fetch(
    `https://api.openai.com/v1/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // WILL NOT WORK
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
