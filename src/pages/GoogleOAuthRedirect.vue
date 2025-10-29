<template>
  <div class="oauth-redirect">
    <div class="loading-container">
      <div class="spinner"></div>
      <p>{{ statusMessage }}</p>
    </div>
    <ConfirmModal
      v-model="loginSuccessOpen"
      title="로그인 성공!"
      :showActions="false"
      :showClose="false"
      :autoCloseMs="1500"
      :allowBackdropClose="false"
      @close="redirectToProfile"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/utils/api";
import ConfirmModal from "@/components/modal/ConfirmModal.vue";

export default {
  name: "GoogleOAuthRedirect",
  components: { ConfirmModal },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const statusMessage = ref("구글 로그인 처리 중...");
    const loginSuccessOpen = ref(false);

    const handleGoogleLogin = async (code) => {
      try {
        console.log("구글 로그인 시도 - 받은 코드:", code);
        statusMessage.value = "로그인 처리 중...";

        console.log("백엔드로 전송할 요청:", {
          url: "/member/google/login",
          data: { code: code },
        });

        const response = await api.post("/member/google/login", {
          code: code,
        });

        console.log("백엔드 응답:", response);
        console.log("응답 데이터:", response.data);

        // 백엔드 응답 구조: {message, code, data: {accessToken, memberId}}
        const responseData = response.data?.data || response.data;

        if (responseData && responseData.accessToken) {
          // JWT 토큰 저장
          localStorage.setItem("accessToken", responseData.accessToken);
          if (responseData.memberId) {
            localStorage.setItem("memberId", responseData.memberId.toString());
          }
          localStorage.setItem("user", JSON.stringify(responseData));

          statusMessage.value = "로그인 성공!";
          loginSuccessOpen.value = true;
        } else {
          throw new Error("로그인 응답 데이터가 올바르지 않습니다.");
        }
      } catch (error) {
        console.error("구글 로그인 오류:", error);
        console.error("에러 응답:", error.response);
        console.error("에러 요청:", error.request);
        console.error("에러 메시지:", error.message);

        let errorMsg = "알 수 없는 오류가 발생했습니다.";
        if (error.response?.status === 401) {
          errorMsg =
            "백엔드에서 인증이 필요하다고 응답했습니다. 백엔드 설정에서 /member/google/login 경로를 인증 제외 경로로 설정해주세요.";
        } else if (error.response?.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error.message) {
          errorMsg = error.message;
        }

        statusMessage.value = `로그인 실패: ${errorMsg}`;

        setTimeout(() => {
          router.push("/login");
        }, 5000);
      }
    };

    const redirectToProfile = () => {
      router.replace("/users/profile");
    };

    onMounted(() => {
      console.log("리다이렉트 페이지 로드됨");

      // URL에서 code 추출 (두 가지 방법 모두 시도)
      let code = route.query.code;
      if (!code) {
        // URLSearchParams로도 시도
        const urlParams = new URLSearchParams(window.location.search);
        code = urlParams.get("code");
      }

      // error 파라미터 확인
      let error = route.query.error;
      if (!error) {
        const urlParams = new URLSearchParams(window.location.search);
        error = urlParams.get("error");
      }

      console.log("전체 쿼리 파라미터:", route.query);
      console.log("현재 URL:", window.location.href);
      console.log("추출된 code:", code);
      console.log("추출된 error:", error);

      if (error) {
        console.error("구글 인증 에러:", error);
        statusMessage.value = "로그인이 취소되었습니다.";
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      if (!code) {
        console.error("인증 코드가 없습니다!");
        statusMessage.value = "인증 코드를 받지 못했습니다.";
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      console.log("코드 확인 완료, 로그인 처리 시작");
      handleGoogleLogin(code);
    });

    return {
      statusMessage,
      loginSuccessOpen,
      redirectToProfile,
    };
  },
};
</script>

<style scoped>
.oauth-redirect {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.loading-container {
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-container p {
  color: #666;
  font-size: 16px;
}
</style>
