<template>
  <div class="login-container">
    <div class="logo-section">
      <img src="@/assets/logo.png" alt="Buying Logo" class="logo-img" />
      <h1 class="brand-title">Buying</h1>
    </div>
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
      <div class="signup-link-section">
        <p>계정이 없으신가요?</p>
        <button class="signup-toggle-btn" @click="toggleSignUp">
          {{ isSignUp ? "로그인하기" : "회원가입하기" }}
        </button>
      </div>
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
import ConfirmModal from "@/components/modal/ConfirmModal.vue";
import { redirectToGoogle } from "@/utils/googleOAuth";
import { login, signup } from "@/services/authService";

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

        await login(loginForm.value.email, loginForm.value.password);
        loginSuccessOpen.value = true;
      } catch (error) {
        handleLoginError(error);
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

        await signup(
          signupForm.value.email,
          signupForm.value.password,
          signupForm.value.nickname
        );
        alert("회원가입 성공! 로그인해주세요.");
        isSignUp.value = false;
        signupForm.value = { email: "", password: "", nickname: "" };
      } catch (error) {
        handleSignupError(error);
      }
    };

    const handleLoginError = (error) => {
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
    };

    const handleSignupError = (error) => {
      if (error.response?.status === 409) {
        alert("이미 존재하는 이메일입니다.");
      } else {
        alert("회원가입 중 오류가 발생했습니다.");
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

<style>
@import "@/styles/pages/LoginPage.css";
</style>
