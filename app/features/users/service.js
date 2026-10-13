export function createUserService(api) {
  return {
    list: (query = {}) => api('/users/', { query }),
    get: id => api(`/users/${encodeURIComponent(id)}`),
    create: body => api('/users/create', { method: 'POST', body }),
    update: (id, body) => api(`/users/update/${encodeURIComponent(id)}`, { method: 'PUT', body }),
    remove: id => api(`/users/delete/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    changePassword: body => api('/users/change-password', { method: 'PUT', body }),
    createForm: () => api('/users/form/create'),
    updateForm: id => api(`/users/form/update/${encodeURIComponent(id)}`),
    // Backend តម្រូវឱ្យមាន ID ក្នុង URL ប៉ុន្តែជ្រើសរើសគណនីតាម token របស់អ្នកដែលបានចូលប្រព័ន្ធ។
    basicInfo: id => api(`/users/info/${encodeURIComponent(id)}`),
  }
}
