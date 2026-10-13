import { computed, ref } from 'vue'
import { getApiData, getApiError } from '../../utils/apiResponse.js'
import { useApiAction } from '../../composables/useApiAction.js'

function positiveInteger(value, label) {
  const number = Number(value)
  if (!Number.isSafeInteger(number) || number < 1) throw new Error(`${label} must be a positive integer`)
  return number
}

/** គ្រប់គ្រងទិន្នន័យ និងសកម្មភាពអ្នកប្រើ ដោយគ្មាន UI។ ទទួល service ជា parameter ដើម្បីងាយស្រួលធ្វើតេស្ត។ */
export function createUsersController(service, options = {}) {
  const users = ref([])
  const selectedUser = ref(null)
  const basicInfo = ref(null)
  const page = ref(1)
  const perPage = ref(20)
  const listQuery = ref({ sort: 'created_at', dir: 'desc' })
  const total = ref(0)
  const listPending = ref(false)
  const listError = ref(null)
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)))
  const hasPreviousPage = computed(() => page.value > 1)
  const hasNextPage = computed(() => page.value < totalPages.value)
  let requestVersion = 0
  let loaded = false
  let sessionVersion = 0

  function reset() {
    requestVersion++
    sessionVersion++
    loaded = false
    users.value = []
    selectedUser.value = null
    basicInfo.value = null
    page.value = 1
    perPage.value = 20
    total.value = 0
    listQuery.value = { sort: 'created_at', dir: 'desc' }
    listPending.value = false
    listError.value = null
    for (const action of [showAction, createAction, updateAction, removeAction, passwordAction, infoAction]) action.reset()
  }

  async function loadUsers() {
    const version = ++requestVersion
    listPending.value = true
    listError.value = null
    try {
      const response = await service.list({ ...listQuery.value, page: page.value, per_page: perPage.value })
      const data = getApiData(response)
      if (!Array.isArray(data?.users) && data?.users != null) throw new Error('Invalid user list response')
      const count = Number(response.total)
      if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid pagination total')
      if (version !== requestVersion) return
      total.value = count
      const lastPage = Math.max(1, Math.ceil(count / perPage.value))
      // កែទំព័រឱ្យត្រឹមត្រូវ ពេលលុបទិន្នន័យចុងក្រោយក្នុងទំព័រ ឬពេលចំនួនទិន្នន័យសរុបថយចុះ។
      if (page.value > lastPage) {
        page.value = lastPage
        return await loadUsers()
      }
      users.value = data?.users ?? []
      loaded = true
      return users.value
    } catch (failure) {
      if (version !== requestVersion) return
      listError.value = getApiError(failure)
      throw failure
    } finally {
      if (version === requestVersion) listPending.value = false
    }
  }

  async function setFilters(query = {}) {
    listQuery.value = { ...query }
    page.value = 1
    return loadUsers()
  }

  async function setPage(value) {
    page.value = positiveInteger(value, 'Page')
    return loadUsers()
  }

  async function setPerPage(value) {
    perPage.value = Math.min(positiveInteger(value, 'Page size'), 200)
    page.value = 1
    return loadUsers()
  }

  async function refreshAfterMutation() {
    if (!loaded) return
    // ការរក្សាទុកបានជោគជ័យរួចហើយ។ បើការផ្ទុកបញ្ជីឡើងវិញបរាជ័យ កំហុសត្រូវរក្សាទុកក្នុង listError។
    try { await loadUsers() } catch { /* កំហុសអាចអានបានតាម listError */ }
  }

  const showAction = useApiAction(async id => {
    const session = sessionVersion
    const data = getApiData(await service.get(positiveInteger(id, 'User ID')))
    if (session !== sessionVersion) return
    selectedUser.value = data.user
    return selectedUser.value
  })
  const createAction = useApiAction(async body => {
    const session = sessionVersion
    const data = getApiData(await service.create(body))
    if (session !== sessionVersion) return
    await refreshAfterMutation()
    return data.user
  })
  const updateAction = useApiAction(async (id, body) => {
    const session = sessionVersion
    const userID = positiveInteger(id, 'User ID')
    const data = getApiData(await service.update(userID, body))
    if (session !== sessionVersion) return
    if (selectedUser.value?.id === userID) selectedUser.value = data.user
    await refreshAfterMutation()
    return data.user
  })
  const removeAction = useApiAction(async id => {
    const session = sessionVersion
    const userID = positiveInteger(id, 'User ID')
    const data = getApiData(await service.remove(userID))
    if (session !== sessionVersion) return
    if (selectedUser.value?.id === userID) selectedUser.value = null
    await refreshAfterMutation()
    return data
  })
  const passwordAction = useApiAction(async body => {
    const session = sessionVersion
    const data = getApiData(await service.changePassword(body))
    if (session !== sessionVersion) return
    await options.onPasswordChanged?.()
    return data
  })

  const infoAction = useApiAction(async id => {
    const session = sessionVersion
    const data = getApiData(await service.basicInfo(positiveInteger(id, 'User ID')))
    if (session !== sessionVersion) return
    basicInfo.value = data.user_info
    return basicInfo.value
  })

  return {
    users, selectedUser, basicInfo, page, perPage, total, totalPages, listQuery,
    hasPreviousPage, hasNextPage, listPending, listError,
    reset, loadUsers, refresh: loadUsers, setPage, setPerPage, setFilters,
    nextPage: () => hasNextPage.value ? setPage(page.value + 1) : Promise.resolve(),
    previousPage: () => hasPreviousPage.value ? setPage(page.value - 1) : Promise.resolve(),
    showUser: showAction.execute, showPending: showAction.pending, showError: showAction.error,
    createUser: createAction.execute, createPending: createAction.pending, createError: createAction.error,
    updateUser: updateAction.execute, updatePending: updateAction.pending, updateError: updateAction.error,
    removeUser: removeAction.execute, removePending: removeAction.pending, removeError: removeAction.error,
    changePassword: passwordAction.execute, passwordPending: passwordAction.pending, passwordError: passwordAction.error,
    getBasicInfo: infoAction.execute, infoPending: infoAction.pending, infoError: infoAction.error,
    createForm: async () => getApiData(await service.createForm()),
    updateForm: async id => getApiData(await service.updateForm(positiveInteger(id, 'User ID'))),
  }
}