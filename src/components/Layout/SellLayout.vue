<template>
  <div class="sell-layout">
    <SellHeader @close="handleClose" @draft="handleDraft" />
    <div class="sell-layout__body">
      <router-view />
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import SellHeader from './SellHeader.vue'

export default {
  name: 'SellLayout',
  components: { SellHeader },
  setup() {
    const router = useRouter()

    const handleClose = () => {
      if (window.history.length > 1) {
        router.back()
      } else {
        router.replace('/')
      }
    }

    const handleDraft = () => {
      alert('임시저장 기능은 준비 중입니다.')
    }

    return {
      handleClose,
      handleDraft,
    }
  },
}
</script>

<style scoped>
.sell-layout {
  min-height: 100vh;
  background: #f1f5f9;
  display: flex;
  flex-direction: column;
}

.sell-layout__body {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px 16px 24px;
}

.sell-layout__body > * {
  width: 100%;
  max-width: 430px;
}

@media (max-width: 480px) {
  .sell-layout__body {
    padding: 12px 0 24px;
  }

  .sell-layout__body > * {
    max-width: 100%;
  }
}
</style>
