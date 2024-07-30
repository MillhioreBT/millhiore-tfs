import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
	output: "server",
	integrations: [],
	experimental: {
		serverIslands: true,
	},
})
