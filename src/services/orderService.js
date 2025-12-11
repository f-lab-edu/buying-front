import api from '@/utils/api'

/**
 * 주문 생성
 * @param {Object} payload - { postId: number, quantity: number }
 * @returns {Promise} { orderId, orderName, amount }
 */
export const createOrder = async (payload) => {
  const response = await api.post('/orders', payload)
  // 백엔드 응답: 직접 OrderCreateResponse DTO 반환 (ApiResponse로 감싸지 않음)
  return response.data
}

