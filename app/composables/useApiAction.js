import { ref } from 'vue'
import { getApiError } from '../utils/apiResponse.js'

/** ប្រើ action មួយសម្រាប់សកម្មភាពនីមួយៗ។ បញ្ជូនកំហុសទៅអ្នកហៅ ដើម្បីឱ្យអ្នកហៅសម្រេចការប្ដូរទំព័រ។ */
export function useApiAction(action) {
  const pending = ref(false)
  const error = ref(null)
  let active = null
  let version = 0

  function execute(...args) {
    // ការចុចម្ដងទៀតប្រើប្រតិបត្តិការដែលកំពុងដំណើរការ ដើម្បីជៀសវាងការបញ្ជូនសំណើស្ទួន។
    if (active) return active
    pending.value = true
    error.value = null
    const executionVersion = version
    active = Promise.resolve().then(() => {
      if (executionVersion !== version) return
      return action(...args)
    }).catch(failure => {
      if (executionVersion === version) error.value = getApiError(failure)
      throw failure
    }).finally(() => {
      if (executionVersion === version) {
        pending.value = false
        active = null
      }
    })
    return active
  }

  function reset() {
    version++
    active = null
    pending.value = false
    error.value = null
  }

  return { pending, error, execute, reset }
}
