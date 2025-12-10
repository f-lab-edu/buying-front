<template>
  <div class="payment-fail-page">
    <div class="fail">
      <div class="error-icon">✗</div>
      <h1>결제가 실패했습니다</h1>
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
import '@/styles/pages/PaymentFailPage.css'

export default {
  name: 'PaymentFailPage',
  setup() {
    const router = useRouter()
    const errorMessage = ref('결제가 취소되었거나 실패했습니다.')

    const goHome = () => {
      router.push('/')
    }

    const goBack = () => {
      router.back()
    }

    onMounted(() => {
      // URL에서 에러 메시지 추출 (토스페이먼츠가 제공하는 경우)
      const urlParams = new URLSearchParams(window.location.search)
      const message = urlParams.get('message')
      if (message) {
        errorMessage.value = decodeURIComponent(message)
      }
    })

    return {
      errorMessage,
      goHome,
      goBack
    }
  }
}
</script>

