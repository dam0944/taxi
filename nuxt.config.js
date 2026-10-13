export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true
  },
  modules: ['@nuxt/ui', '@nuxtjs/i18n', '@pinia/nuxt'],
  components: [
    '~/components',
    { path: '~/features/users/components', prefix: 'Users', pathPrefix: false },
    { path: '~/features/roles/components', prefix: 'Roles', pathPrefix: false },
    { path: '~/features/permissions/components', prefix: 'Permissions', pathPrefix: false },
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: 'http://127.0.0.1:8887/api/v1',
    }
  },
  i18n: {
    defaultLocale: 'en',
    strategy: 'no_prefix',
    locales: [
      { code: 'km', language: 'km-KH', name: 'Khmer' },
      { code: 'en', language: 'en-US', name: 'English' },
      { code: 'zh', language: 'zh-CN', name: 'Chinese' }
    ]
  }
})
