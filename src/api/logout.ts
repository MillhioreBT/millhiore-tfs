import { defineAction, z } from "astro:actions"
import { deleteSession } from "&/session"

export const logoutAction = defineAction({
	accept: "form",
	input: z.object({}),
	handler: (_, { cookies }) => {
		try {
			deleteSession(cookies)
			return true
		} catch (e) {
			return undefined
		}
	},
})
