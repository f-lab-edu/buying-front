<template>
  <div class="oauth-redirect">
    <div class="loading-container">
      <div class="spinner"></div>
      <p class="status-message">{{ statusMessage }}</p>
    </div>
    <ConfirmModal
      v-model="loginSuccessOpen"
      title="로그인 성공!"
      :showActions="false"
      :showClose="false"
      :autoCloseMs="1500"
      :allowBackdropClose="false"
      @close="redirectToMain"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import ConfirmModal from "@/components/modal/ConfirmModal.vue";
import { saveToken } from "@/utils/auth";
import { getOAuthToken } from "@/services/oauthService";

export default {
  name: "GoogleOAuthRedirect",
  components: { ConfirmModal },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const statusMessage = ref("구글 로그인 처리 중...");
    const loginSuccessOpen = ref(false);

    const handleTokenReceived = (tokenData) => {
      saveToken(tokenData.accessToken, tokenData.memberId);
      router.replace("/");
    };

    const handleOAuthError = (error) => {
      statusMessage.value = `로그인 실패: ${
        error.message || "알 수 없는 오류"
      }`;
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    };

    const handleOAuth2Success = async () => {
      try {
        statusMessage.value = "로그인 처리 중...";
        const urlParams = new URLSearchParams(window.location.search);
        const tokenData = await getOAuthToken(urlParams);
        handleTokenReceived(tokenData);
      } catch (error) {
        handleOAuthError(error);
      }
    };

    const redirectToMain = () => {
      router.replace("/");
    };

    onMounted(() => {
      const error =
        route.query.error ||
        new URLSearchParams(window.location.search).get("error");

      if (error) {
        statusMessage.value = "로그인이 취소되었습니다.";
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      handleOAuth2Success();
    });

    return {
      statusMessage,
      loginSuccessOpen,
      redirectToMain,
    };
  },
};
</script>

<style>
@import "@/styles/components/OAuthRedirect.css";
</style>
