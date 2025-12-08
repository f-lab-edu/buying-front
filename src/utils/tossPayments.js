/**
 * 토스페이먼츠 결제 유틸리티
 * 토스페이먼츠 SDK를 사용한 결제 요청 관련 함수들
 */
import { getTossClientKey, getSuccessUrl, getFailUrl } from '@/config/tossPayments'

/**
 * 토스페이먼츠 Payment Widget 초기화
 * @param {string} customerId - 고객 ID (회원 ID 사용)
 * @returns {Promise} PaymentWidget 인스턴스
 */
export async function initializePaymentWidget(customerId) {
  try {
    // 동적 import로 SDK 로드 (필요할 때만 로드)
    const { loadPaymentWidget } = await import('@tosspayments/payment-widget-sdk')
    
    const clientKey = getTossClientKey()
    
    if (!clientKey) {
      throw new Error('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.')
    }
    
    const paymentWidget = await loadPaymentWidget(clientKey, customerId)
    
    return paymentWidget
  } catch (error) {
    console.error('토스페이먼츠 위젯 초기화 실패:', error)
    throw error
  }
}

/**
 * 결제 요청
 * @param {Object} paymentWidget - PaymentWidget 인스턴스
 * @param {Object} options - 결제 옵션
 * @param {string} options.orderId - 주문 번호
 * @param {string} options.orderName - 주문명
 * @param {number} options.amount - 결제 금액
 * @param {string} options.customerEmail - 고객 이메일 (선택)
 * @param {string} options.customerName - 고객 이름 (선택)
 */
export async function requestPayment(paymentWidget, options) {
  try {
    const { orderId, orderName, amount, customerEmail, customerName } = options
    
    if (!orderId || !orderName || !amount) {
      throw new Error('주문 정보가 올바르지 않습니다.')
    }
    
    const successUrl = getSuccessUrl()
    const failUrl = getFailUrl()
    
    await paymentWidget.requestPayment({
      orderId,
      orderName,
      amount,
      successUrl,
      failUrl,
      customerEmail,
      customerName,
    })
  } catch (error) {
    console.error('결제 요청 실패:', error)
    throw error
  }
}

/**
 * URL에서 결제 정보 추출 (성공 URL의 쿼리 파라미터)
 * @param {string} url - 현재 URL 또는 쿼리 문자열
 * @returns {Object} { paymentKey, orderId, amount }
 */
export function extractPaymentInfo(url = window.location.href) {
  try {
    const urlObj = new URL(url)
    const params = new URLSearchParams(urlObj.search)
    
    return {
      paymentKey: params.get('paymentKey'),
      orderId: params.get('orderId'),
      amount: params.get('amount') ? parseInt(params.get('amount')) : null,
    }
  } catch (error) {
    console.error('결제 정보 추출 실패:', error)
    return {
      paymentKey: null,
      orderId: null,
      amount: null,
    }
  }
}

