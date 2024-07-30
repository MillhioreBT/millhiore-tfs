import { db } from "&/database"
import { scripts } from "&/schema"

export const getScripts = async () => {
	const data = await db.select().from(scripts)
	return data
}
