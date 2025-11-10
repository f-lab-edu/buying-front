<template>
  <div :class="wrapperClasses">
    <div class="header-shell__inner">
      <div class="header-shell__slot header-shell__slot--left">
        <slot name="left" />
      </div>
      <div class="header-shell__slot header-shell__slot--center">
        <slot name="center" />
      </div>
      <div class="header-shell__slot header-shell__slot--right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderShell',
  props: {
    fixed: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    shadow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    wrapperClasses() {
      return [
        'header-shell',
        { 'header-shell--fixed': this.fixed },
        { 'header-shell--rounded': this.rounded },
        { 'header-shell--shadow': this.shadow },
      ]
    },
  },
}
</script>

<style scoped>
.header-shell {
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  background: #ffffff;
}

.header-shell--fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-shell--rounded {
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}

.header-shell--shadow {
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.12);
}

.header-shell__inner {
  max-width: 430px;
  margin: 0 auto;
  width: 100%;
  min-height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
}

.header-shell__slot {
  display: flex;
  align-items: center;
}

.header-shell__slot--left {
  flex: 0 0 auto;
  justify-content: flex-start;
  min-width: 44px;
}

.header-shell__slot--center {
  flex: 1 1 auto;
  justify-content: center;
  text-align: center;
}

.header-shell__slot--right {
  flex: 0 0 auto;
  justify-content: flex-end;
  min-width: 44px;
}
</style>
