import { useAuthToken } from './useAuthToken.js'
import { createApiClient } from '../utils/apiClient.js'

export function useApiClient() {
  const config = useRuntimeConfig()
  return createApiClient($fetch, {
    baseURL: config.public.apiBase,
    token: useAuthToken(),
  })
}
