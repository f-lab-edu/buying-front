<template>
  <div class="payment-success-page">
    <div v-if="isProcessing" class="processing">
      <div class="spinner"></div>
      <p>결제를 처리하고 있습니다...</p>
    </div>
    <div v-else-if="isSuccess" class="success">
      <div class="success-icon">✓</div>
      <h1>결제가 완료되었습니다!</h1>
      <p>주문번호: {{ orderId }}</p>
      <p>결제 금액: {{ formatPrice(amount) }}원</p>
      <div class="actions">
        <button @click="goHome" class="primary-button">홈으로 가기</button>
        <button @click="goToOrderDetail" class="secondary-button">주문 내역 보기</button>
      </div>
    </div>
    <div v-else-if="isError" class="error">
      <div class="error-icon">✗</div>
      <h1>결제 처리 중 오류가 발생했습니다</h1>
      <p>{{ errorMessage }}</p>
      <div class="actions">
        <button @click="goBack" class="primary-button">다시 시도</button>
        <button @click="goHome" class="secondary-button">홈으로 가기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { extractPaymentInfo } from '@/utils/tossPayments'
import { approvePayment } from '@/services/paymentService'
import { formatPrice } from '@/utils/format'
import '@/styles/pages/PaymentSuccessPage.css'

export default {
  name: 'PaymentSuccessPage',
  setup() {
    const router = useRouter()
    
    const isProcessing = ref(true)
    const isSuccess = ref(false)
    const isError = ref(false)
    const errorMessage = ref('')
    const orderId = ref('')
    const amount = ref(0)

    /**
     * 결제 승인 처리
     */
    const processPayment = async () => {
      try {
        // 1. URL에서 결제 정보 추출
        const paymentInfo = extractPaymentInfo(window.location.href)
        
        if (!paymentInfo.paymentKey || !paymentInfo.orderId || !paymentInfo.amount) {
          throw new Error('결제 정보가 올바르지 않습니다.')
        }
        orderId.value = paymentInfo.orderId
        amount.value = paymentInfo.amount

        // 2. 백엔드 결제 승인 API 호출
        await approvePayment({
          paymentKey: paymentInfo.paymentKey,
          orderId: paymentInfo.orderId,
          amount: paymentInfo.amount
        })

        // 3. 성공 처리
        isProcessing.value = false
        isSuccess.value = true
      } catch (error) {
        console.error('결제 승인 실패:', error)
        isProcessing.value = false
        isError.value = true
        // 백엔드 에러 응답: ErrorResponse { message, code }
        errorMessage.value = error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다.'
      }
    }

    const goHome = () => {
      router.push('/')
    }

    const goBack = () => {
      router.back()
    }

    const goToOrderDetail = () => {
      // 주문 상세 페이지로 이동 (나중에 구현)
      alert('주문 내역 기능은 준비 중입니다.')
    }

    onMounted(() => {
      processPayment()
    })

    return {
      isProcessing,
      isSuccess,
      isError,
      errorMessage,
      orderId,
      amount,
      formatPrice,
      goHome,
      goBack,
      goToOrderDetail
    }
  }
}
</script>

