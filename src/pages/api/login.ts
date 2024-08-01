import { type APIRoute } from "astro"
import { eq } from "drizzle-orm"
import { db } from "&/database"
import { users } from "&/schema"
import z from "zod"
import bcrypt from "bcrypt"
import { createSession } from "&/session"

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

export const POST: APIRoute = async ({ cookies, request }) => {
	const { email, password } = await request.json()
	const result = loginSchema.safeParse({ email, password })
	if (!result.success) {
		const issues: Record<string, string> = result.error.errors.reduce(
			(acc, issue) => ({ ...acc, [issue.path.join(".")]: issue.message }),
			{}
		)
		return new Response(JSON.stringify(issues), { status: 400 })
	}

	try {
		const foundUsers = await db.select().from(users).where(eq(users.email, email))
		if (foundUsers.length === 0) {
			return new Response(JSON.stringify({ email: "Email or Password incorrect" }), { status: 404 })
		}

		const user = foundUsers[0]
		if (user.password) {
			const passwordMatch = await bcrypt.compare(password, user.password)
			if (!passwordMatch) {
				return new Response(JSON.stringify({ email: "Email or Password incorrect" }), {
					status: 404,
				})
			}
		}

		createSession(cookies, {
			id: user.id,
			username: user.username || "no provided",
			email: user.email || "no provided",
			role: user.role || "user",
			tokens: user.tokens || 0,
		})
		return new Response(null, { status: 200 })
	} catch (e) {
		return new Response(null, { status: 500 })
	}
}
