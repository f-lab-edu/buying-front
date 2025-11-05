<template>
  <div
    v-if="modelValue"
    class="modal-backdrop"
    @click.self="handleBackdropClick"
  >
    <div class="modal-card">
      <button v-if="showClose" class="close" @click="handleCancel">x</button>
      <div class="img-wrap">
        <img :src="computedImageSrc" alt="modal" />
      </div>
      <h3 class="title">{{ title }}</h3>
      <div v-if="showActions" class="actions">
        <button class="primary" @click="handleConfirm">
          {{ confirmText }}
        </button>
        <button class="secondary" @click="handleCancel">
          {{ cancelText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmModal",
  props: {
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: "" },
    confirmText: { type: String, default: "확인" },
    cancelText: { type: String, default: "취소" },
    imageSrc: { type: String, default: "" },
    showActions: { type: Boolean, default: true },
    showClose: { type: Boolean, default: true },
    autoCloseMs: { type: Number, default: 0 },
    allowBackdropClose: { type: Boolean, default: true },
  },
  emits: ["update:modelValue", "confirm", "cancel", "close"],
  data() {
    return { timerId: null };
  },
  computed: {
    computedImageSrc() {
      return this.imageSrc || require("@/assets/modal.png");
    },
  },
  watch: {
    modelValue(val) {
      if (val && this.autoCloseMs > 0) {
        clearTimeout(this.timerId);
        this.timerId = setTimeout(() => {
          this.handleClose();
        }, this.autoCloseMs);
      } else {
        clearTimeout(this.timerId);
      }
    },
  },
  methods: {
    handleConfirm() {
      this.$emit("confirm");
      this.$emit("update:modelValue", false);
    },
    handleCancel() {
      this.$emit("cancel");
      this.$emit("update:modelValue", false);
    },
    handleClose() {
      this.$emit("close");
      this.$emit("update:modelValue", false);
    },
    handleBackdropClick() {
      if (this.allowBackdropClose) {
        this.handleCancel();
      }
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2100;
}
.modal-card {
  width: 380px;
  max-width: 92vw;
  background: #fff;
  border-radius: 14px;
  position: relative;
  padding: 22px 18px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
.close {
  position: absolute;
  right: 10px;
  top: 6px;
  background: transparent;
  border: none;
  font-size: 14px;
  cursor: pointer;
}
.img-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
}
.img-wrap img {
  width: 120px;
  height: 120px;
  object-fit: contain;
}
.title {
  text-align: center;
  margin: 14px 0 16px;
  font-size: 22px;
  font-weight: 800;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.primary {
  height: 44px;
  background: #ff2b1a;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
}
.primary:hover {
  filter: brightness(0.95);
}
.secondary {
  height: 44px;
  background: #fff;
  color: #222;
  border: 1px solid #cfcfcf;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
}
</style>
