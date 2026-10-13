import { useAuthStore } from '../features/auth/store.js'
import { storeBindings } from '../utils/storeBindings.js'

export { createAuthController } from '../features/auth/controller.js'

export function useAuth() {
  return storeBindings(useAuthStore())
}
