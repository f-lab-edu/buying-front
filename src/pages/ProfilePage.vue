<template>
  <div class="profile-page">
    <!-- 상단 Back Bar (NoHeaderLayout이므로 페이지 내에서 구현) -->
    <div class="top-bar">
      <button class="back-btn" @click="goBack">←</button>
      <span class="title">사용자 정보</span>
      <span class="right-space"></span>
    </div>

    <!-- 프로필 섹션 -->
    <div class="avatar-wrap">
      <img :src="avatarSrc" alt="profile" class="avatar" />
    </div>
    <div class="user-name">{{ profile.name || "-" }}</div>
    <div class="user-email">{{ profile.email || "-" }}</div>

    <!-- 버튼 그룹 -->
    <div class="btn-group">
      <button class="btn primary" @click="showWip">판매 목록</button>
      <button class="btn primary" @click="showWip">채팅방 목록</button>
      <button class="btn outline" @click="showWip">회원정보 수정</button>
      <button class="btn outline logout-btn" @click="openLogoutConfirm">로그아웃</button>
    </div>

    <CommonModal
      v-model="modalOpen"
      title="Buying"
      message="아직 개발중 입니다"
      :autoCloseMs="2000"
    />

    <ConfirmModal
      v-model="logoutOpen"
      :title="'로그아웃 할거야 멍?'"
      :confirmText="'로그아웃'"
      :cancelText="'취소'"
      :imageSrc="require('@/assets/modal.png')"
      @confirm="logout"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "@/utils/api";
import CommonModal from "@/components/modal/CommonModal.vue";
import ConfirmModal from "@/components/modal/ConfirmModal.vue";

export default {
  name: "ProfilePage",
  components: { CommonModal, ConfirmModal },
  setup() {
    const router = useRouter();
    const profile = ref({ name: "", email: "" });
    const modalOpen = ref(false);
    const logoutOpen = ref(false);

    const avatarSrc = computed(() => require("@/assets/profile.png"));

    const fetchProfile = async () => {
      try {
        const res = await api.get("/member/profile");
        const data = res.data?.data || {};
        profile.value = {
          name: data.name || "",
          email: data.Email || "",
        };
      } catch (e) {
        router.replace("/login");
      }
    };

    const goBack = () => {
      if (window.history.length > 1) router.back();
      else router.push("/");
    };

    const showWip = () => {
      modalOpen.value = true;
    };

    const openLogoutConfirm = () => {
      logoutOpen.value = true;
    };

    const logout = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("memberId");
      localStorage.removeItem("user");
      router.replace("/");
    };

    onMounted(() => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.replace("/login");
        return;
      }
      fetchProfile();
    });

    return { profile, modalOpen, logoutOpen, avatarSrc, goBack, showWip, openLogoutConfirm, logout };
  },
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 16px 20px 100px;
  background: #fff;
}
.top-bar {
  position: sticky;
  top: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0 16px;
  z-index: 10;
}
.back-btn {
  border: none;
  background: transparent;
  font-size: 22px;
  cursor: pointer;
}
.title {
  font-size: 14px;
  color: #222;
}
.right-space {
  width: 22px;
}

.avatar-wrap {
  display: flex;
  justify-content: center;
  margin: 28px 0 10px;
}
.avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
.user-name {
  text-align: center;
  margin-top: 10px;
  font-size: 16px;
  color: #111;
}
.user-email {
  text-align: center;
  margin-top: 6px;
  font-size: 13px;
  color: #777;
}

.btn-group {
  margin: 28px auto 0;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.btn {
  height: 44px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all .15s ease;
}
.primary {
  background: #222;
  color: #fff;
  border: none;
}
.outline {
  background: #fff;
  color: #222;
  border: 1px solid #ccc;
}
.logout-btn:hover {
  background: #ff2b1a;
  color: #fff;
  border-color: #ff2b1a;
}
</style>
