import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	username: text("username").unique(),
	email: text("email").unique(),
	password: text("password"),
	tokens: integer("tokens").default(0),
	role: text("role").default("user"),
})

export const scripts = sqliteTable("scripts", {
	id: text("id").primaryKey(),
	userId: text("user_id"),
	name: text("name"),
	content: text("content"),
})
