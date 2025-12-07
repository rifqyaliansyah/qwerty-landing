// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
  app: {
    head: {
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
