import { type APIRoute } from "astro"
import { getRefreshSession } from "&/session"

export const GET: APIRoute = async ({ cookies, redirect, url }) => {
	const session = await getRefreshSession(cookies)
	if (!session) {
		return redirect("/login")
	}

	const redirectTo = url.searchParams.get("redirect")
	return redirect(decodeURIComponent(redirectTo || "/dashboard"))
}
