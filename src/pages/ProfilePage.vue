<template>
  <div class="profile-page">
    <div class="top-bar">
      <button class="back-btn" @click="goBack">←</button>
      <span class="title">사용자 정보</span>
      <span class="right-space"></span>
    </div>
    <div class="avatar-wrap">
      <img :src="avatarSrc" alt="profile" class="avatar" />
    </div>
    <div class="user-name">{{ profile.name || "-" }}</div>
    <div class="user-email">{{ profile.email || "-" }}</div>
    <div class="btn-group">
      <button class="btn primary" @click="showWip">판매 목록</button>
      <button class="btn primary" @click="showWip">채팅방 목록</button>
      <button class="btn outline" @click="showWip">회원정보 수정</button>
      <button class="btn outline logout-btn" @click="openLogoutConfirm">
        로그아웃
      </button>
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
      @confirm="handleLogout"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "@/utils/api";
import CommonModal from "@/components/modal/CommonModal.vue";
import ConfirmModal from "@/components/modal/ConfirmModal.vue";
import { logout } from "@/utils/auth";

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

    const handleLogout = () => {
      logout();
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

    return {
      profile,
      modalOpen,
      logoutOpen,
      avatarSrc,
      goBack,
      showWip,
      openLogoutConfirm,
      handleLogout,
    };
  },
};
</script>

<style>
@import "@/styles/pages/ProfilePage.css";
</style>
