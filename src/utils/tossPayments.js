/**
 * 토스페이먼츠 결제 유틸리티
 * 토스페이먼츠 SDK v2를 사용한 결제 요청 관련 함수들
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
 * 토스페이먼츠 SDK v2 초기화 및 Widgets 객체 생성
 * @param {string|number} memberId - 고객 ID (회원 ID 사용)
 * @returns {Promise} Widgets 인스턴스
 */
export async function initializePaymentWidget(memberId) {
  try {
    console.log('🔍 initializePaymentWidget 호출, memberId:', memberId, typeof memberId)
    
    // memberId를 CustomerKey 형식으로 변환
    const customerKey = formatCustomerKey(memberId)
    console.log('✅ 변환된 CustomerKey:', customerKey)
    
    // TossPayments SDK가 로드되었는지 확인
    if (typeof window.TossPayments === 'undefined') {
      throw new Error('토스페이먼츠 SDK가 로드되지 않았습니다. index.html에 스크립트 태그가 있는지 확인해주세요.')
    }
    
    const clientKey = getTossClientKey()
    
    if (!clientKey) {
      throw new Error('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.')
    }
    
    console.log('🔑 ClientKey 사용:', clientKey.substring(0, 20) + '...')
    
    // 클라이언트 키 유효성 검사
    // 결제위젯 연동 키: test_gck_ 또는 live_gck_로 시작해야 함
    // API 개별 연동 키(test_ck_, live_ck_)는 사용할 수 없음
    if (clientKey.startsWith('test_ck_') || clientKey.startsWith('live_ck_')) {
      throw new Error('API 개별 연동 키는 결제위젯에서 사용할 수 없습니다. 결제위젯 연동 키(test_gck_ 또는 live_gck_로 시작)를 사용해주세요.')
    }
    
    if (!clientKey.startsWith('test_gck_') && !clientKey.startsWith('live_gck_')) {
      console.warn('⚠️ 클라이언트 키 형식이 올바르지 않을 수 있습니다. 결제위젯 연동 키(test_gck_ 또는 live_gck_)를 사용해야 합니다.')
    }
    
    // SDK v2 방식: TossPayments 초기화 후 widgets 생성
    const tossPayments = window.TossPayments(clientKey)
    const widgets = tossPayments.widgets({ customerKey })
    
    console.log('✅ PaymentWidget 초기화 완료')
    return widgets
  } catch (error) {
    console.error('❌ 토스페이먼츠 위젯 초기화 실패:', error)
    
    // 401 오류인 경우 더 명확한 메시지 제공
    if (error.message && error.message.includes('401')) {
      throw new Error('토스페이먼츠 클라이언트 키가 유효하지 않습니다. 환경 변수 VUE_APP_TOSS_CLIENT_KEY를 확인해주세요.')
    }
    
    throw error
  }
}

/**
 * 결제 위젯을 DOM에 렌더링 (SDK v2 방식)
 * @param {Object} widgets - Widgets 인스턴스
 * @param {string|HTMLElement} container - 위젯을 렌더링할 컨테이너 (CSS 선택자 또는 DOM 요소)
 * @param {number} amount - 결제 금액
 * @param {number} maxRetries - 최대 재시도 횟수 (기본값: 10)
 * @param {number} retryDelay - 재시도 간격(ms) (기본값: 100)
 */
export async function renderPaymentWidget(widgets, container, amount, maxRetries = 10, retryDelay = 100) {
  try {
    console.log('🎨 PaymentWidget 렌더링 시작, container:', container, 'amount:', amount)
    
    // 컨테이너가 DOM에 나타날 때까지 대기
    let containerElement = null
    let retries = 0
    
    while (!containerElement && retries < maxRetries) {
      containerElement = typeof container === 'string' 
        ? document.querySelector(container) 
        : container
      
      if (!containerElement) {
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        retries++
      }
    }
    
    if (!containerElement) {
      throw new Error(`위젯을 렌더링할 컨테이너를 찾을 수 없습니다. (선택자: ${container})`)
    }
    
    console.log('✅ 컨테이너 찾음:', containerElement)
    
    // SDK v2 방식: 금액 설정
    widgets.setAmount({
      currency: 'KRW',
      value: amount,
    })
    console.log('✅ 금액 설정 완료:', amount)
    
    // amount 검증을 위해 sessionStorage에 저장
    // PaymentSuccessPage에서 URL의 amount와 비교할 때 사용
    sessionStorage.setItem('toss_payment_amount', String(amount))
    
    // 약관 컨테이너 확인
    const agreementContainer = document.querySelector('#agreement')
    if (!agreementContainer) {
      console.warn('⚠️ 약관 컨테이너(#agreement)를 찾을 수 없습니다. 약관 UI가 렌더링되지 않을 수 있습니다.')
    }
    
    // SDK v2 방식: 결제 UI 렌더링
    console.log('🎨 renderPaymentMethods 호출 중...')
    try {
      const paymentMethodSelector = typeof container === 'string' ? container : '#payment-widget'
      await widgets.renderPaymentMethods({
        selector: paymentMethodSelector,
      })
      console.log('✅ renderPaymentMethods 완료')
    } catch (renderError) {
      console.error('❌ renderPaymentMethods 실패:', renderError)
      
      // 401 오류인 경우 명확한 메시지
      if (renderError.message && (renderError.message.includes('401') || renderError.message.includes('Unauthorized'))) {
        throw new Error('토스페이먼츠 인증에 실패했습니다. 클라이언트 키를 확인해주세요.')
      }
      
      throw renderError
    }
    
    // SDK v2 방식: 약관 UI 렌더링
    if (agreementContainer) {
      console.log('🎨 renderAgreement 호출 중...')
      try {
        await widgets.renderAgreement({
          selector: '#agreement',
        })
        console.log('✅ renderAgreement 완료')
      } catch (agreementError) {
        console.error('❌ renderAgreement 실패:', agreementError)
        // 약관 렌더링 실패는 치명적이지 않으므로 경고만 출력
      }
    }
    
    // 위젯 UI가 완전히 렌더링될 때까지 대기
    console.log('⏳ 위젯 UI 준비 대기 중...')
    
    // 최소 1.5초 대기 (토스페이먼츠 위젯이 완전히 준비될 때까지)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 위젯이 실제로 DOM에 추가되었는지 확인
    let renderCheckCount = 0
    const maxRenderChecks = 30 // 최대 3초 추가 대기
    
    while (renderCheckCount < maxRenderChecks) {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // 위젯이 실제로 렌더링되었는지 여러 방법으로 확인
      const hasChildren = containerElement.children.length > 0
      const hasInnerHTML = containerElement.innerHTML.trim().length > 50 // 최소한의 콘텐츠
      const hasPaymentElements = containerElement.querySelector('[class*="payment"], [class*="widget"], button, input') !== null
      const isVisible = containerElement.offsetHeight > 0 && containerElement.offsetWidth > 0
      
      if (hasChildren && hasInnerHTML && hasPaymentElements && isVisible) {
        console.log('✅ 위젯 완전히 렌더링됨:', {
          children: containerElement.children.length,
          innerHTMLLength: containerElement.innerHTML.length,
          visible: isVisible
        })
        break
      }
      
      renderCheckCount++
      
      if (renderCheckCount % 10 === 0) {
        console.log(`⏳ 위젯 렌더링 대기 중... (${renderCheckCount * 100}ms)`)
      }
    }
    
    if (renderCheckCount >= maxRenderChecks) {
      console.warn('⚠️ 위젯 렌더링 확인 실패, 하지만 계속 진행합니다.')
      console.warn('위젯 상태:', {
        children: containerElement.children.length,
        innerHTMLLength: containerElement.innerHTML.length,
        visible: containerElement.offsetHeight > 0
      })
    }
    
    // 최종 안정화 대기
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('✅ PaymentWidget 렌더링 완료')
  } catch (error) {
    console.error('❌ PaymentWidget 렌더링 실패:', error)
    throw error
  }
}

/**
 * 결제 요청 (SDK v2 방식)
 * @param {Object} widgets - Widgets 인스턴스
 * @param {Object} options - 결제 옵션
 * @param {string} options.orderId - 주문 번호
 * @param {string} options.orderName - 주문명
 * @param {number} options.amount - 결제 금액
 * @param {string} options.customerEmail - 고객 이메일 (선택)
 * @param {string} options.customerName - 고객 이름 (선택)
 */
export async function requestPayment(widgets, options) {
  try {
    const { orderId, orderName, amount, customerEmail, customerName } = options
    
    if (!orderId || !orderName || !amount) {
      throw new Error('주문 정보가 올바르지 않습니다.')
    }
    
    const successUrl = getSuccessUrl()
    const failUrl = getFailUrl()
    
    console.log('💳 결제 요청 시작:', { orderId, orderName, amount })
    
    // SDK v2 방식: widgets.requestPayment 사용
    await widgets.requestPayment({
      orderId,
      orderName,
      successUrl,
      failUrl,
      customerEmail,
      customerName,
    })
    
    console.log('✅ 결제 요청 완료')
  } catch (error) {
    console.error('❌ 결제 요청 실패:', error)
    throw error
  }
}

/**
 * URL에서 결제 정보 추출 (성공 URL의 쿼리 파라미터)
 * @param {string} url - 현재 URL 또는 쿼리 문자열
 * @returns {Object} { paymentType, paymentKey, orderId, amount }
 */
export function extractPaymentInfo(url = window.location.href) {
  try {
    const urlObj = new URL(url)
    const params = new URLSearchParams(urlObj.search)
    
    return {
      paymentType: params.get('paymentType'), // NORMAL 또는 BRANDPAY
      paymentKey: params.get('paymentKey'),
      orderId: params.get('orderId'),
      amount: params.get('amount') ? parseInt(params.get('amount')) : null,
    }
  } catch (error) {
    console.error('결제 정보 추출 실패:', error)
    return {
      paymentType: null,
      paymentKey: null,
      orderId: null,
      amount: null,
    }
  }
}
