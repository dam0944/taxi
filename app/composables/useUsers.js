import { useUsersStore } from '../features/users/store.js'
import { storeBindings } from '../utils/storeBindings.js'

export { createUsersController } from '../features/users/controller.js'

export function useUsers() {
  return storeBindings(useUsersStore())
}
