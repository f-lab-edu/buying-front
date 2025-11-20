<template>
  <HeaderShell fixed rounded shadow>
    <template #left>
      <router-link to="/" class="logo-link" aria-label="홈">
        <img src="@/assets/logo.png" alt="Buying Logo" class="logo-img" />
      </router-link>
    </template>

    <template #center>
      <div class="header-center" />
    </template>

    <template #right>
      <div class="icons-container">
        <button
          class="icon-button"
          :class="{ selected: $route.path === '/notifications' }"
          @click="handleNotificationClick"
          aria-label="알림"
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
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <div v-if="hasNewNotification" class="notification-dot"></div>
          </div>
        </button>

        <button
          class="icon-button profile-button"
          :class="{ selected: $route.path === '/users/profile' }"
          @click="handleUserIconClick"
          aria-label="프로필"
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
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>
    </template>
  </HeaderShell>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import HeaderShell from './HeaderShell.vue'

export default {
  name: 'AppHeader',
  components: { HeaderShell },
  setup() {
    const router = useRouter()

    const isLoggedIn = computed(() => !!localStorage.getItem('accessToken'))
    const hasNewNotification = ref(false)
    const profileImg = ref('')
    const nickname = ref('')

    const handleUserIconClick = () => {
      if (isLoggedIn.value) {
        router.push('/users/profile')
      } else {
        router.push('/login')
      }
    }

    const handleNotificationClick = () => {
      if (!isLoggedIn.value) {
        router.push('/login')
        return
      }
      router.push('/notifications')
    }

    return {
      isLoggedIn,
      hasNewNotification,
      profileImg,
      nickname,
      handleUserIconClick,
      handleNotificationClick,
    }
  },
}
</script>

<style scoped>
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

.header-center {
  width: 100%;
}
</style>
