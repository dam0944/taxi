/** បង្រួមទម្រង់ response របស់ Go API ដែលប្រើអក្សរធំសម្រាប់ជោគជ័យ និងអក្សរតូចសម្រាប់បញ្ជី ឬកំហុស។ */
export function getApiData(response) {
  if ((response?.Success ?? response?.success) !== true) {
    const error = new Error(response?.Message ?? response?.message ?? 'Request failed')
    error.code = response?.MessageCode ?? response?.status_code
    error.details = (response?.Data ?? response?.data)?.error
    throw error
  }
  return response.Data ?? response.data
}

export function getApiError(failure) {
  return {
    message: failure?.data?.message ?? failure?.data?.Message ?? failure?.message ?? 'Request failed',
    details: (failure?.data?.Data ?? failure?.data?.data)?.error ?? failure?.details ?? null,
    status: failure?.response?.status ?? failure?.statusCode ?? null,
    code: failure?.data?.MessageCode ?? failure?.data?.status_code ?? failure?.code ?? null,
  }
}
