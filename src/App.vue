<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount } from "vue";
import { initGlobalSSE } from "@/utils/composables/useSSE";

export default {
  name: "App",
  setup() {
    let sseDisconnect = null;

    // 로그인 상태 확인 및 SSE 연결
    const checkAndConnectSSE = () => {
      try {
        const token = localStorage.getItem("accessToken");
        const memberId = localStorage.getItem("memberId");

        if (token && memberId) {
          // 이미 연결되어 있지 않을 때만 연결
          if (!sseDisconnect) {
            sseDisconnect = initGlobalSSE();
          }
        } else {
          // 로그아웃 시 SSE 연결 종료
          if (sseDisconnect) {
            sseDisconnect();
            sseDisconnect = null;
          }
        }
      } catch (error) {
        console.error("SSE 연결 확인 오류:", error);
      }
    };

    // 로그인/로그아웃 이벤트 리스너
    const handleLogin = () => {
      checkAndConnectSSE();
    };

    const handleLogout = () => {
      if (sseDisconnect) {
        try {
          sseDisconnect();
        } catch (error) {
          console.error("SSE 연결 해제 오류:", error);
        }
        sseDisconnect = null;
      }
    };

    onMounted(() => {
      // 초기 로그인 상태 확인 후 SSE 연결
      checkAndConnectSSE();

      // 로그인/로그아웃 커스텀 이벤트 리스너
      window.addEventListener("user-logged-in", handleLogin);
      window.addEventListener("user-logged-out", handleLogout);
    });

    onBeforeUnmount(() => {
      if (sseDisconnect) {
        try {
          sseDisconnect();
        } catch (error) {
          console.error("SSE 연결 해제 오류:", error);
        }
      }
      window.removeEventListener("user-logged-in", handleLogin);
      window.removeEventListener("user-logged-out", handleLogout);
    });

    return {};
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}
</style>
