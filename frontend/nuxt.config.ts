// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Oral e-Health Monitoring Platform",
    },
    layoutTransition: {
      name: "layout",
      mode: "out-in",
    },
  },
  runtimeConfig: {
    apiServer: "http://127.0.0.1:8000/graphql",
    wsServer: "ws://127.0.0.1:8000/ws",

    public: {
      siteUrl: "http://127.0.0.1:3000",
      apiClient: "http://127.0.0.1:8000/graphql",
      wsClient: "ws://127.0.0.1:8000/ws",
    },
  },

  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
    "@/assets/css/main.scss",
    "@/assets/css/tailwind.css",
  ],

  modules: [
    "@nuxtjs/robots",
    "@nuxtjs/i18n",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/apollo",
    "@vueuse/nuxt",
    "@pinia/nuxt",
  ],

  apollo: {
    authType: "JWT",
    clients: {
      default: {
        httpEndpoint:
          process.env.NUXT_PUBLIC_API_CLIENT || "http://127.0.0.1:8000/graphql",
        httpLinkOptions: {
          credentials: "include",
        },
      },
    },
  },

  i18n: {
    locales: [
      { name: "English", code: "en", iso: "en-US", file: "en-US.json" },
      { name: "Portuguese", code: "pt", iso: "pt-PT", file: "pt-PT.json" },
    ],
    defaultLocale: "en",
    lazy: true,
    langDir: "lang",
    vueI18n: {
      fallbackLocale: "en",
    },
  },

  build: {
    transpile: ["vuetify", "vue-toastification", "@vuepic/vue-datepicker"],
  },
});
