/** ហៅក្នុង setup ហើយប្រើ pending, error, data និង refresh ដែលបានត្រឡប់មក។ */
export function useApi(path, options = {}) {
  const api = useApiClient()
  return useFetch(path, { ...options, $fetch: api })
}
