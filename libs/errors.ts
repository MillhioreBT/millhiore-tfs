// MARK: BaseError
abstract class BaseError extends Error {
	constructor(public message: string) {
		super(message)
		this.name = "BaseError"
	}
}

// MARK: Access Token
export class AccessTokenError extends BaseError {
	constructor(message: string) {
		super(message)
		this.name = "AccessTokenError"
	}
}

export class AccessTokenExpiredError extends AccessTokenError {
	constructor(message: string) {
		super(message)
		this.name = "AccessTokenExpiredError"
	}
}

export class AccessTokenNotFoundError extends AccessTokenError {
	constructor(message: string) {
		super(message)
		this.name = "AccessTokenNotFoundError"
	}
}

// MARK: Refresh Token
export class RefreshTokenError extends BaseError {
	constructor(message: string) {
		super(message)
		this.name = "RefreshTokenError"
	}
}

export class RefreshTokenExpiredError extends RefreshTokenError {
	constructor(message: string) {
		super(message)
		this.name = "RefreshTokenExpiredError"
	}
}

export class RefreshTokenNotFoundError extends RefreshTokenError {
	constructor(message: string) {
		super(message)
		this.name = "RefreshTokenNotFoundError"
	}
}

// MARK: JWT Token
export class JwtTokenError extends BaseError {
	constructor(message: string) {
		super(message)
		this.name = "JwtTokenError"
	}
}

// Handler Errors
const ErrorHandlerRecord: Record<string, (error: Error) => void> = {
	AccessTokenError: console.error,
	AccessTokenExpiredError: console.error,
	//AccessTokenNotFoundError: console.error,
	RefreshTokenError: console.error,
	RefreshTokenExpiredError: console.error,
	//RefreshTokenNotFoundError: console.error,
	//JwtTokenError: console.error,
}

export const ErrorHandler = (error: unknown): void => {
	if (error instanceof BaseError) {
		const handler = ErrorHandlerRecord[error.name]
		if (handler) {
			handler(error)
		}
	}
}
