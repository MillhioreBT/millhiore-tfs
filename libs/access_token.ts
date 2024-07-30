import { type AstroCookies as Cookies } from "astro"

import { AccessTokenError, AccessTokenNotFoundError, ErrorHandler } from "&/errors"
import { getToken, createToken, type JwtToken } from "&/jwt_token"
import { ACCESS_TOKEN_KEY, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "&/config"

import ms from "ms"

export interface SessionToken extends JwtToken {
	userId: string
}

export const getAccessToken = (cookies: Cookies): SessionToken | undefined => {
	try {
		if (ACCESS_TOKEN_KEY === undefined) {
			throw new AccessTokenError("The access token key has not been defined")
		}

		if (ACCESS_TOKEN_EXPIRES_IN === undefined) {
			throw new AccessTokenError("Access token expiration time not set")
		}

		const accessToken = cookies.get("access_token")
		if (!accessToken) {
			throw new AccessTokenNotFoundError("Access token not found")
		}

		return getToken<SessionToken>(accessToken.value, ACCESS_TOKEN_KEY)
	} catch (error) {
		ErrorHandler(error)
	}
}

export const createAccessToken = (cookies: Cookies, sessionToken: SessionToken) => {
	try {
		if (ACCESS_TOKEN_KEY === undefined) {
			throw new AccessTokenError("The access token key has not been defined")
		}

		if (ACCESS_TOKEN_EXPIRES_IN === undefined) {
			throw new AccessTokenError("Access token expiration time not set")
		}

		if (REFRESH_TOKEN_EXPIRES_IN === undefined) {
			throw new AccessTokenError("The refresh token expiration time has not been defined")
		}

		sessionToken.exp = Date.now() + ms(ACCESS_TOKEN_EXPIRES_IN)
		const rawToken = createToken<SessionToken>(ACCESS_TOKEN_KEY, sessionToken)
		cookies.set("access_token", rawToken, {
			maxAge: Math.floor(ms(REFRESH_TOKEN_EXPIRES_IN) / 1000),
			path: "/",
			httpOnly: true,
			secure: import.meta.env.PROD,
			sameSite: "strict",
		})
	} catch (error) {
		ErrorHandler(error)
	}
}

export const deleteAccessToken = (cookies: Cookies) => {
	cookies.delete("access_token", {
		path: "/",
	})
}
