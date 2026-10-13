import { defineStore, skipHydrate } from 'pinia'
import { watch } from 'vue'
import { createAuthController } from './controller.js'
import { createAuthService } from './service.js'
import { useApiClient } from '../../composables/useApiClient.js'
import { useAuthToken } from '../../composables/useAuthToken.js'

export const useAuthStore = defineStore('auth', () => {
  const nuxtApp = useNuxtApp()
  const token = useAuthToken()
  const state = createAuthController(createAuthService(useApiClient()), token, () =>
    nuxtApp.runWithContext(() => navigateTo('/login'))
  )
  watch(token, state.reset, { flush: 'sync' })
  return { ...state, token: skipHydrate(state.token), $reset: state.reset }
})
