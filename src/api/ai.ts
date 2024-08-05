import { defineAction, z } from "astro:actions"

export const aiAction = defineAction({
	accept: "form",
	input: z.object({
		question: z.string({ message: "Expected a question" }),
	}),
	handler: ({ question }) => {
		try {
			return question
		} catch (e) {
			return undefined
		}
	},
})
