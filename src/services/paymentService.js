import api from '@/utils/api'

/**
 * 결제 승인
 * @param {Object} payload - { paymentKey: string, orderId: string, amount: number, pgProvider: string }
 * @param {string} payload.paymentKey - 결제 키
 * @param {string} payload.orderId - 주문 번호
 * @param {number} payload.amount - 결제 금액
 * @param {string} payload.pgProvider - 결제사 (TOSS, KAKAO, NAVER, PAYCO)
 * @returns {Promise}
 */
export const approvePayment = async (payload) => {
  const response = await api.post('/payment/approve', payload)
  return response.data
}

