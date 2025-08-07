export async function fetchAIResponse(question: string, tabText: string) {
  if (!question || !tabText) return;
  const limitedTabText = tabText?.split(/\s+/)?.slice(0, 100)?.join(" ");

  const prompt = `
  You are ClarityAI, an intelligent assistant built into a Chrome extension. Your role is to help users understand or extract insights from the current webpage they are viewing.
  The user has asked the following question: "${question}"
  The content of the current web page is: "${limitedTabText}"
  Using only the provided page content, generate a clear, accurate, and helpful answer to the user's query. Do not make assumptions or include information not explicitly stated in the content.
  Your response must be:
  1. Under 60 words strictly.
  2. Concise and easy to understand.
  3. Focused strictly on the context of the tab.
  Avoid filler language or speculation. Prioritize clarity and relevance.`;

  // const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     model: "gpt-3.5-turbo",
  //     message: [{ role: "user", content: prompt }],
  //     temperature: 0.7,
  //   }),
  // });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent`,
    {
      method: "POST",
      headers: {
        "x-goog-api-key": `${import.meta.env.VITE_GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
        },
      }),
    }
  );

  const data = await response.json();
  // return data?.choices?.[0]?.message?.content || "Something went wrong";
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text || "Something went wrong"
  );
}
