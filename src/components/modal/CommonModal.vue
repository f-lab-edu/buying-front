<template>
  <div v-if="open" class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <div class="modal-header">
        <img src="@/assets/logo.png" alt="Buying" class="modal-logo" />
        <button class="modal-close" @click="handleClose">×</button>
      </div>
      <div class="modal-body">
        <h3 class="modal-title">{{ title }}</h3>
        <p class="modal-message">{{ message }}</p>
      </div>
      <div v-if="showActions" class="modal-actions">
        <button class="primary" @click="handleClose">확인</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommonModal",
  props: {
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: "" },
    message: { type: String, default: "" },
    autoCloseMs: { type: Number, default: 2000 },
    showActions: { type: Boolean, default: true },
  },
  emits: ["update:modelValue", "close"],
  data() {
    return { timerId: null };
  },
  computed: {
    open() {
      return this.modelValue;
    },
  },
  watch: {
    open(val) {
      if (val) {
        clearTimeout(this.timerId);
        if (this.autoCloseMs > 0) {
          this.timerId = setTimeout(() => {
            this.handleClose();
          }, this.autoCloseMs);
        }
      } else {
        clearTimeout(this.timerId);
      }
    },
  },
  methods: {
    handleClose() {
      this.$emit("update:modelValue", false);
      this.$emit("close");
    },
  },
  beforeUnmount() {
    clearTimeout(this.timerId);
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-card {
  width: 360px;
  max-width: 92vw;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 20px;
}
.modal-logo {
  width: 56px;
  height: 56px;
  object-fit: contain;
}
.modal-close {
  position: absolute;
  right: 12px;
  top: 8px;
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}
.modal-body {
  padding: 16px 20px 0 20px;
  text-align: center;
}
.modal-title {
  margin: 10px 0 6px;
  font-size: 20px;
}
.modal-message {
  color: #333;
  font-size: 16px;
  margin: 0;
}
.modal-actions {
  padding: 16px 20px 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}
.primary {
  background: #ff3b2f;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  cursor: pointer;
  width: 100%;
}
</style>
