/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly TURSO_DATABASE_URL: string
	readonly TURSO_AUTH_TOKEN: string
	readonly ACCESS_TOKEN_KEY: string
	readonly ACCESS_TOKEN_EXPIRES_IN: string
	readonly REFRESH_TOKEN_KEY: string
	readonly REFRESH_TOKEN_EXPIRES_IN: string
	readonly REFRESH_TOKEN_MAX_USES: number
	readonly GITHUB_CLIENT_ID: string
	readonly GITHUB_CLIENT_SECRET: string
	readonly PERPLEXITY_API_KEY: string
	readonly SALT_ROUNDS: number
	readonly NEW_ACCOUNT_TOKENS: number
}

interface ImportMeta {
	env: ImportMetaEnv
}

interface Session {
	id: string
	username: string
	email: string
	role: string
	tokens: number
}

declare namespace App {
	interface Locals {
		session?: Session
	}
}
