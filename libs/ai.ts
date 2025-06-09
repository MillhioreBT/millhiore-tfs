import { generateText } from "ai";
import { AI_API_KEY, AI_BASE_URL } from "&/config";
import { AIContext } from "&/context";

import { createDeepSeek } from "@ai-sdk/deepseek";

const deepseek = createDeepSeek({
  apiKey: AI_API_KEY ?? "",
  baseURL: AI_BASE_URL ?? "https://api.deepseek.com/v1",
});

const buildPrompt = (prompt: string) => {
  return `Act as an AI assistant for MillhioreTFS.
Use the provided context ${AIContext} to answer questions.
Add line breaks to improve readability.
Use plain text or HTML only, not Markdown or BBCode.
For links:
Use <a> tags with Action and Button classes.
For external links, add target="_blank" and rel="noopener noreferrer".
IMPORTANT: Always enclose code in <code></code> tags. Never use triple backticks (${"```"}) for code blocks.
Respond to the user's question: ${prompt}`;
};

const getCodeFromText = (text: string) => {
  const codeRegex = /```(lua)?\n*(.*?)\n*```/gs;
  const matches = text.match(codeRegex);
  if (!matches) return "";

  return matches
    .map((match) => {
      const codeMatch = /```(lua)?\n*(.*?)\n*```/s.exec(match);
      return codeMatch ? codeMatch[2] : "";
    })
    .join("\n");
};

export const getGeneratedText = async (prompt?: string) => {
  if (!prompt) return { text: "...?", code: "" };

  let { text } = await generateText({
    model: deepseek("deepseek-chat"),
    prompt: buildPrompt(prompt),
    maxTokens: 1000,
    temperature: 0.3,
  });

  const code = getCodeFromText(text);
  text = text.replace(/```(lua)?\n*(.*?)\n*```/gs, "");
  return { text, code };
};
