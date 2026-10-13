import { storeToRefs } from 'pinia'

// Keep reactive state as refs and Pinia's bound actions as functions.
export function storeBindings(store) {
  const actions = Object.fromEntries(
    Object.entries(store).filter(([key, value]) =>
      !key.startsWith('$') && !key.startsWith('_') && typeof value === 'function'
    )
  )
  return { ...storeToRefs(store), ...actions }
}
