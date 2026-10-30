// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  pages: true,
  // Tell Nuxt to load your global stylesheet containing the Bootstrap import
  css: ["~/assets/global.css"],

  runtimeConfig: {
    // Keys inside here are private and only available on the server side
    md5Key9W: process.env.NUXT_MD5_KEY_9W,
    secretKey: process.env.NUXT_SECRET_KEY,

    public: {
      // Keys inside here are exposed to the client/browser bundle
      appTitle: process.env.NUXT_PUBLIC_APP_TITLE,
      useConfigUrl: process.env.NUXT_PUBLIC_STATIC_URL === "true",
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      userBasePath: "/api/v1/user",
    },
  }, // Make sure your v4 layout compatibility mode is locked in
  future: {
    compatibilityVersion: 4,
  },

  routeRules: {
    // If your backend config.js requests go to an external api, proxy them safely:
    "/api/**": { proxy: "https://your-api-server-url.com**" },
  },
  devServer: {
    cors: {
      origin: "*", // Allows local scripts to execute seamlessly during development
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    },
  },
})
