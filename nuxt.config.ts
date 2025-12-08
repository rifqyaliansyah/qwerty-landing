// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: ['@pinia/nuxt'],

  runtimeConfig: {
    // Private keys (server-side only)
    // apiSecret: '',

    // Public keys (exposed to client)
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
  app: {
    head: {
      title: 'My App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        // Download early (non-blocking)
        { rel: "preload", as: "style", href: "/css/plugins.css" },
        { rel: "preload", as: "style", href: "/css/style.css" },
        { rel: "preload", as: "style", href: "/css/navy.css" },

        // Apply CSS (uses preload cache, minimal blocking)
        { rel: "stylesheet", href: "/css/plugins.css" },
        { rel: "stylesheet", href: '/css/style.css' },
        { rel: "stylesheet", href: '/css/navy.css' },
      ],
      script: [
        { src: '/js/plugins.js', tagPosition: "bodyClose" },
        { src: '/js/theme.js', tagPosition: "bodyClose" },
      ]
    }
  },
})
