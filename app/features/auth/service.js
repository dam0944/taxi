/** Services ទទួល API client ហើយមិនគ្រប់គ្រង state របស់ Vue ឬការប្ដូរទំព័រទេ។ */
export function createAuthService(api) {
  return {
    // ហៅ Go API ដោយផ្ទាល់តាម apiBase ដែលកំណត់ក្នុង useApiClient។
    login: (username, password) => api('/auth/login', {
      method: 'POST',
      body: { auth: { username, password } },
    }),
    logout: () => api('/auth/logout', { method: 'POST' }),
  }
}
