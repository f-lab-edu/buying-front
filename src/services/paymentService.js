import api from '@/utils/api'

/**
 * 결제 승인
 * @param {Object} payload - { paymentKey: string, orderId: string, amount: number }
 * @returns {Promise}
 */
export const approvePayment = async (payload) => {
  const response = await api.post('/payment/approve', payload)
  return response.data
}

