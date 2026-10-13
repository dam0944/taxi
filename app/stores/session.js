import { defineStore, skipHydrate } from 'pinia'
import { computed } from 'vue'

// One cookie ref per Pinia instance; no two-way state synchronization needed.
export const useSessionStore = defineStore('session', () => {
  const token = useCookie('em-auth-token', {
    default: () => null,
    path: '/',
    sameSite: 'lax',
    secure: useRequestURL().protocol === 'https:',
  })
  if (typeof token.value !== 'string' || !token.value.trim()) token.value = null
  const isAuthenticated = computed(() => Boolean(token.value))
  function clearSession() { token.value = null }
  return { token: skipHydrate(token), isAuthenticated, clearSession }
})
