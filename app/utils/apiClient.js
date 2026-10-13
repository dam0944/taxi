// Injectable transport keeps authentication behavior independently testable.
export function createApiClient(fetcher, { baseURL, token }) {
  return fetcher.create({
    baseURL,
    onRequest({ options }) {
      const headers = new Headers(options.headers)
      if (token.value) headers.set('Authorization', `Bearer ${token.value}`)
      options.headers = headers
    },
    onResponseError({ options, response }) {
      // An older request must never invalidate a newer login.
      const authorization = new Headers(options.headers).get('Authorization')
      if (response.status === 401 && token.value && authorization === `Bearer ${token.value}`) {
        token.value = null
      }
    },
  })
}
