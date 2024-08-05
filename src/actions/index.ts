import { loginAction } from "@/api/login"
import { logoutAction } from "@/api/logout"
import { registerAction } from "@/api/register"
import { aiAction } from "@/api/ai"

export const server = {
	login: loginAction,
	logout: logoutAction,
	register: registerAction,
	ai: aiAction,
}
