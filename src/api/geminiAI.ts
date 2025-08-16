import { generatePrompt } from "../constants/utils";

export async function fetchGeminiAIResponse(
  question: string,
  tabText: string,
  { queryType }: { queryType?: string }
) {
  if (!question) return;

  let prompt: string = generatePrompt(queryType, question, tabText);

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
