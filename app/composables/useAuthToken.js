import { storeToRefs } from 'pinia'
import { useSessionStore } from '../stores/session.js'

// Compatibility adapter: all callers receive the same cookie-backed token ref.
export function useAuthToken() {
  return storeToRefs(useSessionStore()).token
}
