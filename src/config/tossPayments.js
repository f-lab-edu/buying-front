/**
 * 토스페이먼츠 설정
 * 클라이언트 키는 환경 변수에서 가져오거나 기본값 사용
 */

export const TOSS_PAYMENTS_CONFIG = {
  // 환경 변수에서 가져오기 (Vue CLI는 VUE_APP_ 접두사 필요)
  // 없으면 기본값 사용 (테스트 키)
  clientKey: process.env.VUE_APP_TOSS_CLIENT_KEY || 'test_ck_EP59LybZ8BwOzA0jmpgZ36GYo7pR',
  
  // 성공/실패 URL
  successUrl: `${window.location.origin}/payment/success`,
  failUrl: `${window.location.origin}/payment/fail`,
}

/**
 * 토스페이먼츠 클라이언트 키 가져오기
 */
export function getTossClientKey() {
  return TOSS_PAYMENTS_CONFIG.clientKey
}

/**
 * 성공 URL 가져오기
 */
export function getSuccessUrl() {
  return TOSS_PAYMENTS_CONFIG.successUrl
}

/**
 * 실패 URL 가져오기
 */
export function getFailUrl() {
  return TOSS_PAYMENTS_CONFIG.failUrl
}

