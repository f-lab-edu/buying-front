/**
 * 토스페이먼츠 결제 유틸리티
 * 토스페이먼츠 SDK를 사용한 결제 요청 관련 함수들
 */

import { getTossClientKey, getSuccessUrl, getFailUrl } from '@/config/tossPayments'

/**
 * memberId를 토스페이먼츠 CustomerKey 형식으로 변환
 * CustomerKey 형식: 영문 대소문자, 숫자, 특수문자(`-`,`_`,`=`,`.`,`@`)로 최소 2자 이상 최대 50자 이하
 * @param {string|number} memberId - 회원 ID
 * @returns {string} CustomerKey 형식의 문자열
 */
export function formatCustomerKey(memberId) {
  if (!memberId) {
    throw new Error('memberId가 필요합니다.')
  }
  
  // memberId를 문자열로 변환
  const idStr = String(memberId).trim()
  
  // 빈 문자열 체크
  if (!idStr) {
    throw new Error('memberId가 비어있습니다.')
  }
  
  // 이미 형식에 맞는지 확인 (영문, 숫자, 허용된 특수문자만 포함)
  const validPattern = /^[a-zA-Z0-9\-_=.@]+$/
  
  // 길이가 2자 이상이고 형식에 맞으면 그대로 사용
  if (validPattern.test(idStr) && idStr.length >= 2 && idStr.length <= 50) {
    console.log('✅ CustomerKey 형식 검증 통과:', idStr)
    return idStr
  }
  
  // 형식에 맞지 않거나 1자리면 `customer_${memberId}` 형식으로 변환
  // 항상 customer_ 접두사를 붙여서 최소 2자 이상 보장
  const formattedKey = `customer_${idStr}`
  
  // 최대 길이 체크 (50자 초과 시 자르기)
  const finalKey = formattedKey.length > 50 ? formattedKey.substring(0, 50) : formattedKey
  
  console.log('🔄 CustomerKey 변환:', idStr, '→', finalKey)
  return finalKey
}

/**
 * 토스페이먼츠 Payment Widget 초기화
 * @param {string|number} memberId - 고객 ID (회원 ID 사용)
 * @returns {Promise} PaymentWidget 인스턴스
 */
export async function initializePaymentWidget(memberId) {
  try {
    console.log('🔍 initializePaymentWidget 호출, memberId:', memberId, typeof memberId)
    
    // memberId를 CustomerKey 형식으로 변환
    const customerKey = formatCustomerKey(memberId)
    console.log('✅ 변환된 CustomerKey:', customerKey)
    
    // 동적 import로 SDK 로드 (필요할 때만 로드)
    const { loadPaymentWidget } = await import('@tosspayments/payment-widget-sdk')
    
    const clientKey = getTossClientKey()
    
    if (!clientKey) {
      throw new Error('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.')
    }
    
    console.log('🔑 ClientKey 사용:', clientKey.substring(0, 10) + '...')
    const paymentWidget = await loadPaymentWidget(clientKey, customerKey)
    
    console.log('✅ PaymentWidget 초기화 완료')
    return paymentWidget
  } catch (error) {
    console.error('❌ 토스페이먼츠 위젯 초기화 실패:', error)
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

