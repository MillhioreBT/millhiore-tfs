import { defineAction, z } from "astro:actions"
import { eq } from "drizzle-orm"
import { db } from "&/database"
import { users } from "&/schema"
import { createSession } from "&/session"

import bcrypt from "bcrypt"

export const loginAction = defineAction({
	accept: "form",
	input: z.object({
		email: z
			.string({ message: "Expected a valid email" })
			.email({ message: "Expected a valid email" }),
		password: z
			.string({ message: "Expected a password with at least 8 characters" })
			.min(8, "Expected a password with at least 8 characters"),
	}),
	handler: async ({ email, password }, { cookies }) => {
		try {
			const foundUsers = await db
				.select()
				.from(users)
				.where(eq(users.email, email))
			if (foundUsers.length === 0) {
				return undefined
			}

			const user = foundUsers[0]
			if (user.password) {
				const passwordMatch = await bcrypt.compare(password, user.password)
				if (!passwordMatch) {
					return undefined
				}
			}

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
