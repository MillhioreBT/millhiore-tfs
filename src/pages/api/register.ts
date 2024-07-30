import { type APIRoute } from "astro"
import { eq } from "drizzle-orm"
import { db } from "&/database"
import { users } from "&/schema"
import crypto from "node:crypto"
import z from "zod"
import bcrypt from "bcrypt"
import { SALT_ROUNDS, NEW_ACCOUNT_TOKENS } from "&/config"
import { createSession } from "&/session"

const registerSchema = z.object({
	email: z.string().email(),
	username: z.string().min(3),
	password: z.string().min(8),
	repeatPassword: z.string().min(8),
})

export const POST: APIRoute = async ({ cookies, request }) => {
	const { email, username, password, repeatPassword } = await request.json()

	if (password !== repeatPassword) {
		return new Response(JSON.stringify({ repeatPassword: "Passwords do not match" }), {
			status: 400,
		})
	}

	const result = registerSchema.safeParse({ email, username, password, repeatPassword })
	if (!result.success) {
		const issues: Record<string, string> = result.error.errors.reduce(
			(acc, issue) => ({ ...acc, [issue.path.join(".")]: issue.message }),
			{}
		)
		return new Response(JSON.stringify(issues), { status: 400 })
	}

	const foundUsers = await db.select().from(users).where(eq(users.email, email))
	if (foundUsers.length !== 0) {
		return new Response(JSON.stringify({ email: "Email already exists" }), { status: 409 })
	}

	type insertUser = typeof users.$inferInsert
	const user: insertUser = {
		id: crypto.randomUUID(),
		email,
		username,
		password: await bcrypt.hash(password, SALT_ROUNDS),
	}

	await db.insert(users).values(user)
	createSession(cookies, {
		id: user.id,
		username: user.username || "no provided",
		email: user.email || "no provided",
		role: user.role || "user",
		tokens: NEW_ACCOUNT_TOKENS,
	})
	return new Response(null, { status: 200 })
}
