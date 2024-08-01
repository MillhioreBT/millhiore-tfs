import { type AstroCookies } from "astro"

import { eq } from "drizzle-orm"
import { db } from "&/database"
import { users } from "&/schema"

import {
	getAccessToken,
	createAccessToken,
	deleteAccessToken,
	type SessionToken,
} from "&/access_token"
import {
	createRefreshToken,
	deleteRefreshToken,
	getRefreshToken,
	updateRefreshToken,
} from "&/refresh_token"

import { REFRESH_TOKEN_MAX_USES } from "&/config"

const getSessionUser = async (id: string): Promise<Session | undefined> => {
	try {
		const foundUsers = await db.select().from(users).where(eq(users.id, id))

		if (foundUsers.length === 0) {
			return undefined
		}

		const user = foundUsers[0]

		const sessionUser: Session = {
			id: user.id,
			username: user.username || "no provided",
			email: user.email || "no provided",
			role: user.role || "user",
			tokens: user.tokens || 0,
		}

		return sessionUser
	} catch (e) {
		return undefined
	}
}

export const getSession = async (
	cookies: AstroCookies
): Promise<Session | "expire" | undefined> => {
	const accessToken = getAccessToken(cookies)
	if (accessToken === undefined) {
		return undefined
	}

	if (accessToken.exp == undefined || accessToken.exp < Date.now()) {
		return "expire"
	}

	// Return the session user
	return await getSessionUser(accessToken.userId)
}

export const createSession = (cookies: AstroCookies, sessionUser: Session) => {
	createAccessToken(cookies, {
		userId: sessionUser.id,
	})

	createRefreshToken(cookies, {
		userId: sessionUser.id,
	})
}

export const deleteSession = (cookies: AstroCookies) => {
	deleteAccessToken(cookies)
	deleteRefreshToken(cookies)
}

export const getRefreshSession = async (cookies: AstroCookies) => {
	const refreshToken = getRefreshToken(cookies)
	if (refreshToken === undefined) {
		deleteAccessToken(cookies)
		return undefined
	}

	if (refreshToken.uses == undefined || refreshToken.uses > REFRESH_TOKEN_MAX_USES) {
		deleteSession(cookies)
		return undefined
	}

	if (refreshToken.exp == undefined || refreshToken.exp < Date.now()) {
		deleteSession(cookies)
		return undefined
	}

	// Try create a new access token
	const sessionUser = await getSessionUser(refreshToken.userId)
	if (sessionUser === undefined) {
		deleteSession(cookies)
		return undefined
	}

	const sessionToken: SessionToken = {
		userId: sessionUser.id,
	}

	createAccessToken(cookies, sessionToken)

	refreshToken.uses++
	if (refreshToken.uses >= REFRESH_TOKEN_MAX_USES) {
		deleteRefreshToken(cookies)
	} else {
		updateRefreshToken(cookies, refreshToken)
	}
	return sessionUser
}
