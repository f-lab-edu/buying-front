<template>
  <div class="main-container">
    <div class="content-box">
      <router-view />
    </div>
    <BottomNav />
  </div>
</template>

<script>
import BottomNav from "./BottomNav.vue";

export default {
  name: "AppNoHeaderLayout",
  components: {
    BottomNav,
  },
};
</script>

<style scoped>
.main-container {
  max-width: 430px;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  position: relative;
  border-radius: 24px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background-color: white;
  overflow: hidden;
}

.content-box {
  flex-grow: 1;
  padding: 0px;
  margin-top: 10px;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .main-container {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
  }

  .content-box {
    padding: 0px;
  }
}

@media (max-width: 767px) {
  .main-container {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>
