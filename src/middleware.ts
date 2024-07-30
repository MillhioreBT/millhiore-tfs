import { defineMiddleware } from "astro:middleware"
import { getSession } from "&/session"

export const onRequest = defineMiddleware(async (context, next) => {
	const session = await getSession(context.cookies)
	if (typeof session === "object") {
		context.locals.session = session
		return next()
	}

	console.log(session)

	if (session === "expire" && context.url.pathname !== "/api/refresh") {
		console.log("Session expired")
		const currentUrl = encodeURIComponent(context.url.pathname + context.url.search)
		return context.redirect(`/api/refresh?redirect=${currentUrl}`)
	}
	return next()
})
