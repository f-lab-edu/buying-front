import api from '@/utils/api'

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x200?text=No+Image'

export const fetchProducts = async () => {
  try {
    const response = await api.get('/posts/lists')
    const posts = response.data?.data?.posts ?? []

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      price: post.price,
      quantity: post.quantity ?? 1,
      status: post.status ?? '',
      thumbnailUrl: post.thumbnailUrl || PLACEHOLDER_IMAGE,
      member: post.member ?? null
    }))
  } catch (error) {
    console.error('상품 목록 조회 오류:', error)
    return []
  }
}

export const getPostDetail = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}`)
    return response.data?.data ?? null
  } catch (error) {
    console.error(`게시물 상세 조회 오류 (${postId}):`, error)
    throw error
  }
}
