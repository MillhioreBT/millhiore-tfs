import { defineMiddleware } from "astro:middleware"
import { getSession } from "&/session"

export const onRequest = defineMiddleware(async (context, next) => {
	const session = await getSession(context.cookies)
	if (typeof session === "object") {
		context.locals.session = session
		return next()
	}

	if (session === "expire" && context.url.pathname !== "/api/refresh") {
		const currentUrl = encodeURIComponent(context.url.pathname + context.url.search)
		return context.redirect(`/api/refresh?redirect=${currentUrl}`)
	}
	return next()
})
