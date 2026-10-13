import { computed } from 'vue'
import { getApiData, getApiError } from '../../utils/apiResponse.js'
import { useApiAction } from '../../composables/useApiAction.js'

export function createAuthController(service, token, onLogout = async () => { }) {
  let sessionVersion = 0
  const isAuthenticated = computed(() => Boolean(token.value))

  const loginAction = useApiAction(async (username, password) => {
    if (logoutAction.pending.value) throw new Error('Please wait for sign-out to finish.')
    if (!username?.trim() || !password) throw new Error('Username and password are required')
    const session = sessionVersion
    const startingToken = token.value
    const data = getApiData(await service.login(username.trim(), password))
    const accessToken = data?.auth?.token
    if (typeof accessToken !== 'string' || !accessToken) {
      throw new Error('Login response is missing a token')
    }
    if (session !== sessionVersion || token.value !== startingToken) throw new Error('The session changed while signing in. Please try again.')
    token.value = accessToken
    return data
  })

  const logoutAction = useApiAction(async () => {
    sessionVersion++
    loginAction.reset()
    // ពិនិត្យ response របស់ backend មុនលុប token។ ក៏គាំទ្រ response ទទេផងដែរ។
    const startingToken = token.value
    try {
      const response = await service.logout()
      if (response) getApiData(response)
    } catch (failure) {
      // A revoked/expired backend session is already logged out.
      if (getApiError(failure).status !== 401) throw failure
    }
    if (token.value !== startingToken && token.value !== null) return
    token.value = null
    await onLogout()
  })

  function reset() {
    sessionVersion++
    loginAction.reset()
    logoutAction.reset()
  }

  return {
    reset, token, isAuthenticated,
    login: loginAction.execute,
    logout: logoutAction.execute,
    loginPending: loginAction.pending,
    loginError: loginAction.error,
    logoutPending: logoutAction.pending,
    logoutError: logoutAction.error,
  }
}

