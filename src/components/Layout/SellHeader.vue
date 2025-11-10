<template>
  <header class="sell-header">
    <button class="icon-button" @click="$emit('close')" aria-label="닫기">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <h1 class="title">내 물건 팔기</h1>
    <button class="link-button" type="button" @click="$emit('draft')">
      임시저장
    </button>
  </header>
</template>

<script>
export default {
  name: "SellHeader",
};
</script>

<style scoped>
.sell-header {
  max-width: 430px;
  margin: 0 auto;
  width: 100%;
  min-height: 40px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.icon-button {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  cursor: pointer;
}

.icon-button svg {
  stroke: currentColor;
}

.title {
  font-size: 17px;
  font-weight: 600;
  color: #111827;
}

.link-button {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 14px;
  cursor: pointer;
}
</style>
