<template>
  <div class="bottom-nav-container">
    <div class="bottom-navigation">
      <button
        v-for="item in navItems"
        :key="item.value"
        class="nav-item"
        :class="{ active: currentValue === item.value }"
        @click="handleNavClick(item.value)"
      >
        <div class="nav-icon">
          <component
            :is="currentValue === item.value ? item.selectedIcon : item.icon"
          />
        </div>
        <span class="nav-label">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

// 아이콘 컴포넌트들
const HomeIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  `,
};

const HomeOutlinedIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  `,
};

const SearchIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  `,
};

const SearchOutlinedIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  `,
};

const BookmarkIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  `,
};

const BookmarkBorderIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  `,
};

const PersonIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  `,
};

const PersonOutlineIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  `,
};

export default {
  name: "AppBottomNav",
  components: {
    HomeIcon,
    HomeOutlinedIcon,
    SearchIcon,
    SearchOutlinedIcon,
    BookmarkIcon,
    BookmarkBorderIcon,
    PersonIcon,
    PersonOutlineIcon,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const currentValue = ref(route.path);

    const navItems = [
      {
        label: "홈",
        value: "/",
        icon: HomeOutlinedIcon,
        selectedIcon: HomeIcon,
      },
      {
        label: "검색",
        value: "/search",
        icon: SearchOutlinedIcon,
        selectedIcon: SearchIcon,
      },
      {
        label: "즐겨찾기",
        value: "/favorites",
        icon: BookmarkBorderIcon,
        selectedIcon: BookmarkIcon,
      },
      {
        label: "프로필",
        value: "/profile",
        icon: PersonOutlineIcon,
        selectedIcon: PersonIcon,
      },
    ];

    const handleNavClick = (value) => {
      if (value === "/") {
        currentValue.value = value;
        router.push(value);
      } else if (value === "/favorites") {
        currentValue.value = value;
        router.push(value);
      } else if (value === "/search") {
        currentValue.value = value;
        router.push(value);
      } else if (value === "/profile") {
        currentValue.value = value;
        router.push(value);
      } else {
        alert("해당 기능은 추후 구현 예정입니다.");
      }
    };

    // 라우트 변경 감지
    watch(
      () => route.path,
      (newPath) => {
        if (
          newPath.startsWith("/favorites") ||
          newPath.startsWith("/bookmarks")
        ) {
          currentValue.value = "/favorites";
        } else if (
          newPath.startsWith("/profile") ||
          newPath.startsWith("/users/profile")
        ) {
          currentValue.value = "/profile";
        } else {
          const currentNavItem = navItems.find(
            (item) => newPath.startsWith(item.value) && item.value !== "/"
          );
          currentValue.value = currentNavItem
            ? currentNavItem.value
            : newPath === "/"
            ? "/"
            : "";
        }
      }
    );

    return {
      navItems,
      currentValue,
      handleNavClick,
    };
  },
};
</script>

<style scoped>
.bottom-nav-container {
  max-width: 430px;
  margin: 0 auto;
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  border-top: 1px solid #e0e0e0;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.bottom-navigation {
  max-width: 430px;
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  padding: 4px 0;
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
}

.nav-item:hover {
  color: #333;
}

.nav-item.active {
  color: #000;
}

.nav-icon {
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-label {
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .bottom-nav-container {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
  }

  .bottom-navigation {
    max-width: 100%;
    padding: 0 24px;
    border-radius: 0;
  }
}

@media (max-width: 767px) {
  .bottom-nav-container {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
  }

  .bottom-navigation {
    max-width: 100%;
    padding: 0 16px;
    border-radius: 0;
  }
}
</style>
