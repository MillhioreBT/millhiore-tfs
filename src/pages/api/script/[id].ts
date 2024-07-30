import { type APIRoute } from "astro"
import { eq } from "drizzle-orm"
import { db } from "&/database"
import { scripts } from "&/schema"
import crypto from "node:crypto"

export const POST: APIRoute = async ({ params, request, locals }) => {
	const isAdminUser = locals.session?.role === "admin"
	if (!isAdminUser) {
		return new Response(null, { status: 401 })
	}

	const { id } = params
	const content = await request.text()
	type insertScript = typeof scripts.$inferInsert
	const script: insertScript = {
		id: crypto.randomUUID(),
		userId: "1",
		name: id,
		content,
	}

	await db.insert(scripts).values(script)
	return new Response(null, { status: 200 })
}

export const GET: APIRoute = async ({ params }) => {
	const { id: name } = params
	if (!name) {
		return new Response(null, { status: 400 })
	}

	const results = await db.select().from(scripts).where(eq(scripts.name, name))
	if (!results || results.length === 0) {
		return new Response(JSON.stringify({ message: `No script found with the name: ${name}` }), {
			status: 404,
		})
	}

	return new Response(results[0].content, { status: 200 })
}
