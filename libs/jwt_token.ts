import jwt from "jsonwebtoken"
import { JwtTokenError } from "&/errors"

export interface JwtToken extends Record<string, unknown> {
	id?: string
	uses?: number
	exp?: number
}

export type JwtTokenEncode = string

export const getToken = <T>(token: string, key?: JwtTokenEncode): T | never => {
	try {
		if (key === undefined) {
			throw new JwtTokenError("Token key not defined")
		}

		const payload = jwt.verify(token, key)
		return payload as T
	} catch (error) {
		throw new JwtTokenError("Error decoding token")
	}
}

export const createToken = <T extends JwtToken>(
	key?: string,
	object?: T
): JwtTokenEncode | never => {
	try {
		if (key === undefined) {
			throw new JwtTokenError("Token key not defined")
		}

		if (object === undefined) {
			throw new JwtTokenError("Token object not defined")
		}

		return jwt.sign(object, key) as JwtTokenEncode
	} catch (error) {
		throw new JwtTokenError("Error encoding token")
	}
}

export const updateToken = <T extends JwtToken>(
	key?: string,
	object?: T
): JwtTokenEncode | never => {
	try {
		if (key === undefined) {
			throw new JwtTokenError("Token id not defined")
		}

		if (object === undefined) {
			throw new JwtTokenError("Token object not defined")
		}

		return jwt.sign(object, key) as JwtTokenEncode
	} catch (error) {
		throw new JwtTokenError("Error encoding token")
	}
}
