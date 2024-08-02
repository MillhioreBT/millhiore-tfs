import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [],
  experimental: {
    serverIslands: true
  },
  adapter: vercel()
});