import { eq } from "drizzle-orm"
import { db } from "&/database"
import { users } from "&/schema"

export const useToken = async (session: Session) => {
	const tokens = session.tokens
	if (tokens <= 0) {
		return false
	}

	try {
		await db
			.update(users)
			.set({ tokens: tokens - 1 })
			.where(eq(users.id, session.id))
		session.tokens = tokens - 1
		return true
	} catch (e) {
		return false
	}
}
