import { db } from "&/database";
import { scripts } from "&/schema";

export const getScripts = async () => {
  try {
    const data = await db.select().from(scripts);
    return data;
  } catch (e) {
    console.error("Error fetching scripts:", e);
    return undefined;
  }
};
