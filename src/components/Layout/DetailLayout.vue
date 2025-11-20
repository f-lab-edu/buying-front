<template>
  <div class="detail-layout">
    <div class="detail-container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailLayout'
}
</script>

<style scoped>
.detail-layout {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
}

.detail-container {
  width: 100%;
  max-width: 430px;
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(15, 23, 42, 0.08);
  min-height: 100vh;
}

@media (max-width: 767px) {
  .detail-layout {
    background: #ffffff;
  }

  .detail-container {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>
