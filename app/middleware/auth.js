import { useSessionStore } from '../stores/session.js'

export default defineNuxtRouteMiddleware(() => {
  if (!useSessionStore().isAuthenticated) return navigateTo('/login')
})
