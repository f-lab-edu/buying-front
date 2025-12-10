import api from '@/utils/api'

/**
 * 주문 생성
 * @param {Object} payload - { postId: number, quantity: number }
 * @returns {Promise} { orderId, orderName, amount }
 */
export const createOrder = async (payload) => {
  const response = await api.post('/orders', payload)
  // 응답 형식: { message: "...", code: 201, data: { orderId, orderName, amount } }
  return response.data.data  // data 필드만 반환
}

