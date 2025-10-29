<template>
  <div class="header-container">
    <div class="toolbar">
      <router-link to="/" class="logo-link">
        <img src="@/assets/logo.png" alt="Buying Logo" class="logo-img" />
      </router-link>

      <div class="icons-container">
        <button
          class="icon-button"
          :class="{ selected: $route.path === '/notifications' }"
          @click="handleNotificationClick"
        >
          <div class="notification-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <div v-if="hasNewNotification" class="notification-dot"></div>
          </div>
        </button>

        <button
          class="icon-button profile-button"
          :class="{ selected: $route.path === '/users/profile' }"
          @click="handleUserIconClick"
        >
          <div v-if="isLoggedIn && profileImg" class="profile-avatar">
            <img :src="profileImg" :alt="nickname || '프로필'" />
          </div>
          <svg
            v-else
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "AppHeader",
  setup() {
    const router = useRouter();

    // 로그인 상태 확인
    const isLoggedIn = computed(() => {
      return !!localStorage.getItem("accessToken");
    });

    const hasNewNotification = ref(false);
    const profileImg = ref("");
    const nickname = ref("");

    const handleUserIconClick = () => {
      if (isLoggedIn.value) {
        router.push("/users/profile");
      } else {
        router.push("/login");
      }
    };

    const handleNotificationClick = () => {
      if (!isLoggedIn.value) {
        router.push("/login");
        return;
      }
      router.push("/notifications");
    };

    return {
      isLoggedIn,
      hasNewNotification,
      profileImg,
      nickname,
      handleUserIconClick,
      handleNotificationClick,
    };
  },
};
</script>

<style scoped>
.header-container {
  max-width: 430px;
  margin: 0 auto;
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1000;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar {
  max-width: 430px;
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-img {
  height: 40px;
  margin: 4px 0;
}

.icons-container {
  display: flex;
  gap: 12px;
  margin-right: -8px;
}

.icon-button {
  width: 40px;
  height: 40px;
  padding: 8px;
  color: #666;
  border-radius: 12px;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.icon-button:active {
  transform: translateY(0);
}

.icon-button.selected {
  color: #000;
  background-color: rgba(0, 0, 0, 0.04);
}

.icon-button.selected svg {
  transform: scale(1.1);
}

.notification-icon {
  position: relative;
}

.notification-dot {
  position: absolute;
  right: 3px;
  top: 3px;
  width: 8px;
  height: 8px;
  background-color: #f44336;
  border-radius: 50%;
  border: 2px solid white;
}

.profile-button {
  padding: 0;
}

.profile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #eee;
  overflow: hidden;
  background-color: #fff;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .header-container {
    max-width: 100%;
    border-radius: 0;
  }

  .toolbar {
    max-width: 100%;
    padding: 0 24px;
  }
}

@media (max-width: 767px) {
  .header-container {
    max-width: 100%;
    border-radius: 0;
  }

  .toolbar {
    max-width: 100%;
    padding: 0 16px;
  }
}
</style>
