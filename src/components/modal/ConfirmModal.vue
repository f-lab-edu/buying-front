<template>
  <div v-if="modelValue" class="modal-backdrop" @click.self="emitCancel">
    <div class="modal-card">
      <button class="close" @click="emitCancel">x</button>
      <div class="img-wrap">
        <img :src="imageSrc" alt="modal" />
      </div>
      <h3 class="title">{{ title }}</h3>
      <div class="actions">
        <button class="primary" @click="emitConfirm">{{ confirmText }}</button>
        <button class="secondary" @click="emitCancel">{{ cancelText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: '' },
    confirmText: { type: String, default: '확인' },
    cancelText: { type: String, default: '취소' },
    imageSrc: { type: String, default: '' }
  },
  emits: ['update:modelValue', 'confirm', 'cancel'],
  methods: {
    emitConfirm() {
      this.$emit('confirm')
      this.$emit('update:modelValue', false)
    },
    emitCancel() {
      this.$emit('cancel')
      this.$emit('update:modelValue', false)
    }
  }
}
</script>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index: 2100; }
.modal-card { width: 380px; max-width: 92vw; background: #fff; border-radius: 14px; position: relative; padding: 22px 18px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.close { position:absolute; right: 10px; top: 6px; background: transparent; border:none; font-size: 14px; cursor: pointer; }
.img-wrap { display:flex; align-items:center; justify-content:center; margin-top: 6px; }
.img-wrap img { width: 120px; height: 120px; object-fit: contain; }
.title { text-align:center; margin: 14px 0 16px; font-size: 22px; font-weight: 800; }
.actions { display:flex; flex-direction: column; gap: 12px; }
.primary { height: 44px; background: #ff2b1a; color:#fff; border:none; border-radius: 10px; cursor:pointer; font-size: 16px; }
.primary:hover { filter: brightness(0.95); }
.secondary { height: 44px; background: #fff; color:#222; border: 1px solid #cfcfcf; border-radius: 10px; cursor: pointer; font-size: 16px; }
</style>
