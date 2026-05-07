import apiClient from './apiClient'

/**
 * POST /api/v1/auth/login
 * @param {string} email
 * @param {string} password
 * @returns {{ accessToken, refreshToken, expiresIn, user: { id, email, fullName, role } }}
 */
export const login = async (email, password) => {
  const { data } = await apiClient.post('/auth/login', { email, password })
  return data
}

/**
 * POST /api/v1/auth/refresh
 * @param {string} refreshToken
 */
export const refresh = async (refreshToken) => {
  const { data } = await apiClient.post('/auth/refresh', { refreshToken })
  return data
}

/**
 * POST /api/v1/auth/logout
 */
export const logout = async () => {
  try {
    await apiClient.post('/auth/logout')
  } finally {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}
