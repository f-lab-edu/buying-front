<template>
  <div class="login-container">
    <!-- 로고 섹션 -->
    <div class="logo-section">
      <img src="@/assets/logo.png" alt="Buying Logo" class="logo-img" />
      <h1 class="brand-title">Buying</h1>
    </div>

    <!-- 로그인 폼 섹션 -->
    <div class="form-section">
      <div class="input-group">
        <label class="input-label">EMAIL</label>
        <input
          type="email"
          v-model="loginForm.email"
          class="input-field"
          placeholder="이메일을 입력하세요"
        />
        <div class="input-underline"></div>
      </div>

      <div class="input-group">
        <label class="input-label">PASSWORD</label>
        <input
          type="password"
          v-model="loginForm.password"
          class="input-field"
          placeholder="비밀번호를 입력하세요"
        />
        <div class="input-underline"></div>
      </div>

      <div class="button-group">
        <button class="login-btn" @click="handleLogin">Log in</button>
        <button class="google-btn" @click="handleGoogleLogin">
          <span class="google-text">Connect with</span>
          <span class="google-brand">Google</span>
        </button>
      </div>

      <!-- 회원가입 링크 -->
      <div class="signup-link-section">
        <p>계정이 없으신가요?</p>
        <button class="signup-toggle-btn" @click="toggleSignUp">
          {{ isSignUp ? "로그인하기" : "회원가입하기" }}
        </button>
      </div>

      <!-- 회원가입 폼 (토글) -->
      <div v-if="isSignUp" class="signup-form">
        <div class="input-group">
          <label class="input-label">NICKNAME</label>
          <input
            type="text"
            v-model="signupForm.nickname"
            class="input-field"
            placeholder="닉네임을 입력하세요"
          />
          <div class="input-underline"></div>
        </div>

        <div class="input-group">
          <label class="input-label">EMAIL</label>
          <input
            type="email"
            v-model="signupForm.email"
            class="input-field"
            placeholder="이메일을 입력하세요"
          />
          <div class="input-underline"></div>
        </div>

        <div class="input-group">
          <label class="input-label">PASSWORD</label>
          <input
            type="password"
            v-model="signupForm.password"
            class="input-field"
            placeholder="비밀번호를 입력하세요"
          />
          <div class="input-underline"></div>
        </div>

        <div class="button-group">
          <button class="login-btn" @click="handleSignUp">Sign Up</button>
          <button class="google-btn" @click="handleGoogleSignUp">
            <span class="google-text">Join with</span>
            <span class="google-brand">Google</span>
          </button>
        </div>
      </div>
    </div>

    <ConfirmModal
      v-model="loginSuccessOpen"
      title="로그인 성공!"
      :showActions="false"
      :showClose="false"
      :autoCloseMs="1500"
      :allowBackdropClose="false"
      @close="redirectHome"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../utils/api";
import ConfirmModal from "@/components/modal/ConfirmModal.vue";
import { redirectToGoogle } from "@/utils/googleOAuth";

export default {
  name: "LoginPage",
  components: { ConfirmModal },
  setup() {
    const router = useRouter();
    const isSignUp = ref(false);

    const loginForm = ref({
      email: "",
      password: "",
    });

    const signupForm = ref({
      email: "",
      password: "",
      nickname: "",
    });

    const loginSuccessOpen = ref(false);
    const redirectHome = () => router.push("/");

    const toggleSignUp = () => {
      isSignUp.value = !isSignUp.value;
    };

    const handleLogin = async () => {
      try {
        if (!loginForm.value.email || !loginForm.value.password) {
          alert("이메일과 비밀번호를 입력해주세요.");
          return;
        }

        console.log("로그인 시도:", loginForm.value); // 디버깅용
        console.log("요청 URL:", "/api/member/login");
        console.log("요청 데이터:", {
          email: loginForm.value.email,
          password: loginForm.value.password,
        });

        const response = await api.post("/member/login", {
          email: loginForm.value.email,
          password: loginForm.value.password,
        });

        console.log("로그인 응답:", response.data); // 디버깅용

        // 백엔드 응답 구조: {message, code, data: {accessToken, memberId}}
        const responseData = response.data?.data || response.data;

        if (responseData && responseData.accessToken) {
          // JWT 토큰 저장
          localStorage.setItem("accessToken", responseData.accessToken);
          if (responseData.memberId) {
            localStorage.setItem("memberId", responseData.memberId.toString());
          }
          localStorage.setItem("user", JSON.stringify(responseData));

          // 성공 모달 (버튼 없음) → 1.5초 뒤 홈으로 이동
          loginSuccessOpen.value = true;
        } else {
          throw new Error("로그인 응답 데이터가 올바르지 않습니다.");
        }
      } catch (error) {
        console.error("로그인 오류:", error);
        console.error("에러 타입:", typeof error);
        console.error("에러 메시지:", error.message);
        console.error("에러 코드:", error.code);
        console.error("에러 응답:", error.response);
        console.error("에러 요청:", error.request);
        console.error("에러 응답:", error.response?.data); // 디버깅용

        if (error.response?.status === 401) {
          alert("이메일 또는 비밀번호가 올바르지 않습니다.");
        } else if (error.response?.status === 404) {
          alert("존재하지 않는 사용자입니다.");
        } else if (
          error.code === "ECONNREFUSED" ||
          error.code === "ERR_NETWORK"
        ) {
          alert(
            "백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
          );
        } else {
          alert(
            `로그인 중 오류가 발생했습니다: ${
              error.response?.data?.message || error.message
            }`
          );
        }
      }
    };

    const handleSignUp = async () => {
      try {
        if (
          !signupForm.value.email ||
          !signupForm.value.password ||
          !signupForm.value.nickname
        ) {
          alert("모든 필드를 입력해주세요.");
          return;
        }

        const response = await api.post("/member/create", {
          email: signupForm.value.email,
          password: signupForm.value.password,
          nickname: signupForm.value.nickname,
        });

        if (response.data) {
          alert("회원가입 성공! 로그인해주세요.");
          isSignUp.value = false;
          signupForm.value = { email: "", password: "", nickname: "" };
        }
      } catch (error) {
        console.error("회원가입 오류:", error);
        if (error.response?.status === 409) {
          alert("이미 존재하는 이메일입니다.");
        } else {
          alert("회원가입 중 오류가 발생했습니다.");
        }
      }
    };

    const handleGoogleLogin = () => {
      redirectToGoogle();
    };

    const handleGoogleSignUp = () => {
      redirectToGoogle();
    };

    return {
      isSignUp,
      loginForm,
      signupForm,
      loginSuccessOpen,
      redirectHome,
      toggleSignUp,
      handleLogin,
      handleSignUp,
      handleGoogleLogin,
      handleGoogleSignUp,
    };
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  box-sizing: border-box;
}

/* 로고 섹션 */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
}

.logo-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 20px;
}

.brand-title {
  font-family: "Brush Script MT", cursive;
  font-size: 2.5rem;
  font-weight: normal;
  color: #333;
  margin: 0;
  letter-spacing: 1px;
}

/* 폼 섹션 */
.form-section {
  width: 100%;
  max-width: 300px;
}

.input-group {
  margin-bottom: 40px;
  text-align: center;
  position: relative;
}

.input-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.input-field {
  width: 100%;
  padding: 8px 0;
  font-size: 1rem;
  border: none;
  background: transparent;
  text-align: center;
  outline: none;
}

.input-field::placeholder {
  color: #ccc;
  font-size: 0.9rem;
}

.input-underline {
  width: 100%;
  height: 1px;
  background-color: #ddd;
  margin: 0 auto;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}

.login-btn,
.google-btn {
  width: 100%;
  height: 48px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn {
  color: #666;
  font-weight: 500;
}

.login-btn:hover {
  background-color: #f5f5f5;
  border-color: #999;
}

.google-btn {
  color: #666;
  font-weight: 400;
}

.google-btn:hover {
  background-color: #f5f5f5;
  border-color: #999;
}

.google-brand {
  font-weight: 600;
  color: #333;
  margin-left: 4px;
}

.google-text {
  color: #666;
}

/* 회원가입 섹션 */
.signup-link-section {
  text-align: center;
  margin-bottom: 20px;
}

.signup-link-section p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.signup-toggle-btn {
  background: none;
  border: none;
  color: #007bff;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
}

.signup-toggle-btn:hover {
  color: #0056b3;
}

.signup-form {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .login-container {
    padding: 20px 16px;
  }

  .logo-img {
    width: 100px;
    height: 100px;
  }

  .brand-title {
    font-size: 2rem;
  }

  .form-section {
    max-width: 280px;
  }
}
</style>
