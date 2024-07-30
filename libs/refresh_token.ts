import { type AstroCookies as Cookies } from "astro"

import { RefreshTokenError, RefreshTokenNotFoundError, ErrorHandler } from "&/errors"
import { getToken, createToken, updateToken, type JwtToken, type JwtTokenEncode } from "&/jwt_token"
import { REFRESH_TOKEN_KEY, REFRESH_TOKEN_EXPIRES_IN } from "&/config"

import ms from "ms"

export interface RefreshToken extends JwtToken {
	userId: string
}

export const getRefreshToken = (cookies: Cookies): RefreshToken | undefined => {
	try {
		if (REFRESH_TOKEN_KEY === undefined) {
			throw new RefreshTokenError("The refresh token key has not been defined")
		}

		if (REFRESH_TOKEN_EXPIRES_IN === undefined) {
			throw new RefreshTokenError("The refresh token expiration time has not been defined")
		}

		const refreshToken = cookies.get("refresh_token")
		if (!refreshToken) {
			throw new RefreshTokenNotFoundError("Access token not found")
		}

		return getToken<RefreshToken>(refreshToken.value, REFRESH_TOKEN_KEY)
	} catch (error) {
		ErrorHandler(error)
	}
}

export const createRefreshToken = (cookies: Cookies, refreshToken: RefreshToken) => {
	try {
		if (REFRESH_TOKEN_KEY === undefined) {
			throw new RefreshTokenError("The refresh token key has not been defined")
		}

		if (REFRESH_TOKEN_EXPIRES_IN === undefined) {
			throw new RefreshTokenError("The refresh token expiration time has not been defined")
		}

		const milliseconds = ms(REFRESH_TOKEN_EXPIRES_IN)
		refreshToken.exp = Date.now() + milliseconds
		refreshToken.uses = 0
		const encodeToken: JwtTokenEncode = createToken<RefreshToken>(REFRESH_TOKEN_KEY, refreshToken)
		cookies.set("refresh_token", encodeToken, {
			maxAge: Math.floor(milliseconds / 1000),
			path: "/api/refresh",
			httpOnly: true,
			secure: import.meta.env.PROD,
			sameSite: "strict",
		})
	} catch (error) {
		ErrorHandler(error)
	}
}

export const updateRefreshToken = (
	cookies: Cookies,
	refreshToken: RefreshToken
): undefined | never => {
	try {
		if (REFRESH_TOKEN_KEY === undefined) {
			throw new RefreshTokenError("The refresh token key has not been defined")
		}

		if (REFRESH_TOKEN_EXPIRES_IN === undefined) {
			throw new RefreshTokenError("The refresh token expiration time has not been defined")
		}

		const encodeToken: JwtTokenEncode = updateToken<RefreshToken>(REFRESH_TOKEN_KEY, refreshToken)
		console.log(refreshToken.uses)
		cookies.set("refresh_token", encodeToken, {
			maxAge: refreshToken.exp,
			path: "/api/refresh",
			httpOnly: true,
			secure: import.meta.env.PROD,
			sameSite: "strict",
		})
	} catch (error) {
		ErrorHandler(error)
	}
}

export const deleteRefreshToken = (cookies: Cookies) => {
	try {
		cookies.delete("refresh_token", { path: "/api/refresh" })
	} catch (error) {
		ErrorHandler(error)
	}
}
