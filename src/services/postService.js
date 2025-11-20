import api from '@/utils/api'

export const createPost = async (payload) => {
  const response = await api.post('/posts', payload)
  return response.data
}
