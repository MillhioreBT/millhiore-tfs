import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"
import { PERPLEXITY_API_KEY } from "&/config"
import { AIContext } from "&/context"

const openai = createOpenAI({
	apiKey: PERPLEXITY_API_KEY,
	baseURL: "https://api.perplexity.ai",
})

const buildPrompt = (prompt: string) => {
	return `Act as an AI assistant for MillhioreTFS.
Use the provided context ${AIContext} to answer questions.
Add line breaks to improve readability.
Use plain text or HTML only, not Markdown or BBCode.
For links:
Use <a> tags with Action and Button classes.
For external links, add target="_blank" and rel="noopener noreferrer".
IMPORTANT: Always enclose code in <code></code> tags. Never use triple backticks (${"```"}) for code blocks.
Respond to the user's question: ${prompt}`
}

const getCodeFromText = (text: string) => {
	const codeRegex = /```(lua)?\n*(.*?)\n*```/gs
	const matches = text.match(codeRegex)
	if (!matches) return ""

	return matches
		.map((match) => {
			const codeMatch = /```(lua)?\n*(.*?)\n*```/s.exec(match)
			return codeMatch ? codeMatch[2] : ""
		})
		.join("\n")
}

export const getGeneratedText = async (prompt?: string) => {
	if (!prompt) return { text: "", code: "" }

	let { text } = await generateText({
		model: openai("llama-3-sonar-large-32k-chat"),
		prompt: buildPrompt(prompt),
		maxTokens: 1000,
		temperature: 0.3,
	})

	const code = getCodeFromText(text)
	text = text.replace(/```(lua)?\n*(.*?)\n*```/gs, "")
	return { text, code }
}
