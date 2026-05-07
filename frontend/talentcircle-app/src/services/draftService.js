import apiClient from './apiClient'

/**
 * GET /api/v1/drafts
 * @param {{ channel?, status?, weekStart?, weekEnd?, page?, size? }} params
 */
export const listDrafts = async (params = {}) => {
  const { data } = await apiClient.get('/drafts', { params })
  return data
}

/**
 * GET /api/v1/drafts/:id
 */
export const getDraftDetail = async (id) => {
  const { data } = await apiClient.get(`/drafts/${id}`)
  return data
}

/**
 * PATCH /api/v1/drafts/:id/content
 * @param {string} id
 * @param {string} content
 */
export const updateDraftContent = async (id, content) => {
  const { data } = await apiClient.patch(`/drafts/${id}/content`, { content })
  return data
}

/**
 * POST /api/v1/drafts/:id/approve
 */
export const approveDraft = async (id) => {
  const { data } = await apiClient.post(`/drafts/${id}/approve`)
  return data
}

/**
 * POST /api/v1/drafts/:id/reject
 * @param {string} id
 * @param {string} reason
 */
export const rejectDraft = async (id, reason) => {
  const { data } = await apiClient.post(`/drafts/${id}/reject`, { reason })
  return data
}
