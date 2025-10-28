<template>
  <div class="login-container">
    <!-- 로고 섹션 -->
    <div class="logo-section">
      <div class="logo-circle">
        <div class="cat-container">
          <div class="cat-body"></div>
          <div class="cat-head">
            <div class="cat-ears">
              <div class="ear left"></div>
              <div class="ear right"></div>
            </div>
            <div class="cat-glasses"></div>
            <div class="cat-eyes">
              <div class="eye left"></div>
              <div class="eye right"></div>
            </div>
            <div class="cat-nose"></div>
            <div class="cat-mouth"></div>
          </div>
          <div class="shopping-bag">
            <div class="bag-body"></div>
            <div class="bag-handle left"></div>
            <div class="bag-handle right"></div>
          </div>
        </div>
      </div>
      <h1 class="brand-title">Buying</h1>
    </div>

    <!-- 로그인 폼 섹션 -->
    <div class="form-section">
      <div class="input-group">
        <label class="input-label">EMAIL</label>
        <div class="input-underline"></div>
      </div>
      
      <div class="input-group">
        <label class="input-label">PASSWORD</label>
        <div class="input-underline"></div>
      </div>

      <div class="button-group">
        <button class="login-btn">Log in</button>
        <button class="google-btn">
          <span class="google-text">Connect with</span>
          <span class="google-brand">Google</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      // 로그인 로직 구현 예정
      console.log('로그인 시도:', { email: this.email, password: this.password })
    },
    handleGoogleLogin() {
      // 구글 로그인 로직 구현 예정
      console.log('구글 로그인 시도')
    }
  }
}
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

.logo-circle {
  width: 120px;
  height: 120px;
  background-color: #FFE4B5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
}

.cat-container {
  position: relative;
  width: 80px;
  height: 80px;
}

.cat-body {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 40px;
  background-color: white;
  border-radius: 30px 30px 0 0;
  border: 2px solid #333;
}

.cat-head {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 45px;
}

.cat-ears {
  position: relative;
  width: 100%;
  height: 20px;
}

.ear {
  position: absolute;
  top: 0;
  width: 15px;
  height: 20px;
  background-color: white;
  border: 2px solid #333;
  border-radius: 50% 50% 0 0;
}

.ear.left {
  left: 5px;
}

.ear.right {
  right: 5px;
}

.ear::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background-color: #FFB6C1;
  border-radius: 50%;
}

.cat-glasses {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 35px;
  height: 20px;
  border: 2px solid #333;
  border-radius: 50%;
}

.cat-eyes {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 35px;
  height: 8px;
}

.eye {
  position: absolute;
  top: 0;
  width: 4px;
  height: 4px;
  background-color: #333;
  border-radius: 50%;
}

.eye.left {
  left: 8px;
}

.eye.right {
  right: 8px;
}

.cat-nose {
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 3px;
  background-color: #333;
  border-radius: 50%;
}

.cat-mouth {
  position: absolute;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 2px;
  border-bottom: 1px solid #333;
  border-radius: 0 0 50% 50%;
}

.shopping-bag {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 25px;
  height: 30px;
}

.bag-body {
  width: 100%;
  height: 100%;
  background-color: #FF8C00;
  border: 2px solid #333;
  border-radius: 4px;
  position: relative;
}

.bag-body::after {
  content: '';
  position: absolute;
  right: 2px;
  top: 2px;
  width: 8px;
  height: 26px;
  background-color: #FF7F00;
  border-radius: 2px;
}

.bag-handle {
  position: absolute;
  top: -4px;
  width: 8px;
  height: 6px;
  border: 2px solid #333;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
}

.bag-handle.left {
  left: 2px;
}

.bag-handle.right {
  right: 2px;
}

.brand-title {
  font-family: 'Brush Script MT', cursive;
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
}

.input-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
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

/* 반응형 디자인 */
@media (max-width: 480px) {
  .login-container {
    padding: 20px 16px;
  }
  
  .logo-circle {
    width: 100px;
    height: 100px;
  }
  
  .cat-container {
    width: 70px;
    height: 70px;
  }
  
  .brand-title {
    font-size: 2rem;
  }
  
  .form-section {
    max-width: 280px;
  }
}
</style>
