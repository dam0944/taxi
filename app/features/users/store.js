import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { createUsersController } from './controller.js'
import { createUserService } from './service.js'
import { useApiClient } from '../../composables/useApiClient.js'
import { useAuthToken } from '../../composables/useAuthToken.js'

// Shared state factory also allows isolated Pinia tests with a mock service.
export function createUsersState(service, options = {}) {
  const controller = createUsersController(service, options)
  const search = ref('')
  const status = ref('')
  const sort = ref('created_at:desc')
  const view = ref('table')

  function $reset() {
    controller.reset()
    search.value = ''
    status.value = ''
    sort.value = 'created_at:desc'
    view.value = 'table'
  }

  function applyFilters() {
    const [column, direction] = sort.value.split(':')
    return controller.setFilters({
      q: search.value.trim(),
      ...(status.value ? { status_id: Number(status.value) } : {}),
      sort: column,
      dir: direction,
    })
  }

  function resetFilters() {
    search.value = ''
    status.value = ''
    sort.value = 'created_at:desc'
    return applyFilters()
  }

  return { ...controller, search, status, sort, view, applyFilters, resetFilters, $reset }
}

export const useUsersStore = defineStore('users', () => {
  const nuxtApp = useNuxtApp()
  const token = useAuthToken()
  const state = createUsersState(createUserService(useApiClient()), {
    async onPasswordChanged() {
      token.value = null
      await nuxtApp.runWithContext(() => navigateTo('/login'))
    },
  })
  watch(token, state.$reset, { flush: 'sync' })
  return state
})
