import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"
import { PERPLEXITY_API_KEY } from "&/config"
import { AIContext } from "&/context"

const openai = createOpenAI({
	apiKey: PERPLEXITY_API_KEY,
	baseURL: "https://api.perplexity.ai",
})

const buildPrompt = (prompt: string) => {
	return `
		Eres un asistente de AI que ayuda a los usuarios a navegar y encontrar informacion en MillhioreTFS.
		
		Aqui tienes un contexto que puedes usar para responder a las preguntas de los usuarios: ${AIContext}.

		Para que sea mas legible tus respuesta intenta agregar saltos de linea luego de cada punto o parrafo.

		No uses formato Markdown o BBCode, solo texto plano o HTML.
		
		Si proporcionas enlaces crea un <a> con el texto que se muestra en el ejemplo y la clase Action y Button.
		
		Pregunta del usuario: ${prompt}
		`
}

export const getGeneratedText = async (prompt?: string) => {
	if (!prompt) return ""

	const { text } = await generateText({
		model: openai("llama-3-sonar-large-32k-chat"),
		prompt: buildPrompt(prompt),
		maxTokens: 1000,
		temperature: 0.5,
	})

	return text
}
