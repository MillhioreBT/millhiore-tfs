import { defineAction, z } from "astro:actions"
import { eq } from "drizzle-orm"
import { db } from "&/database"
import { users } from "&/schema"
import { createSession } from "&/session"
import { SALT_ROUNDS, NEW_ACCOUNT_TOKENS } from "&/config"

import bcrypt from "bcrypt"

export const registerSchema = z.object({
	email: z
		.string({ message: "Expected a valid email" })
		.email({ message: "Expected a valid email" }),
	username: z
		.string({ message: "Expected a username with at least 3 characters" })
		.min(3),
	password: z
		.string({ message: "Expected a password with at least 8 characters" })
		.min(8),
	repeatPassword: z
		.string({ message: "Expected a password with at least 8 characters" })
		.min(8),
})

export const registerAction = defineAction({
	accept: "form",
	input: registerSchema,
	handler: async (
		{ email, username, password, repeatPassword },
		{ cookies }
	) => {
		if (password !== repeatPassword) {
			return undefined
		}

		try {
			const foundUsers = await db
				.select()
				.from(users)
				.where(eq(users.email, email))
			if (foundUsers.length !== 0) {
				return undefined
			}

			type insertUser = typeof users.$inferInsert
			const user: insertUser = {
				id: crypto.randomUUID(),
				email,
				username,
				password: await bcrypt.hash(password, SALT_ROUNDS),
				tokens: NEW_ACCOUNT_TOKENS,
			}

			await db.insert(users).values(user)
			createSession(cookies, {
				id: user.id,
				username: user.username || "no provided",
				email: user.email || "no provided",
				role: user.role || "user",
				tokens: user.tokens || 0,
			})
			return true
		} catch (e) {
			return undefined
		}
	},
})
