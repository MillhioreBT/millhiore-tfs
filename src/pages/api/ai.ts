import { type APIRoute } from "astro"

export const POST: APIRoute = async ({ request }) => {
	const { question } = await request.json()
	if (!question) {
		return new Response(JSON.stringify({ question: "Question is required" }), { status: 400 })
	}

	return new Response(null, { status: 200 })
}
