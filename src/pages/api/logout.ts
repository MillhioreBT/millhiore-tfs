import { type APIRoute } from "astro"
import { deleteSession } from "&/session"

export const GET: APIRoute = async ({ cookies, redirect, locals }) => {
	const session = locals.session
	if (!session) {
		return new Response(null, { status: 401 })
	}

	deleteSession(cookies)
	return redirect("/login")
}
