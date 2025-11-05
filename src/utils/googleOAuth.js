// Spring Security OAuth2 방식 사용
// 프론트엔드에서 직접 구글 로그인 페이지로 가지 않고
// 백엔드의 Spring Security OAuth2 엔드포인트를 통해 처리

// 백엔드 URL 설정 (환경변수 또는 직접 설정)
const BACKEND_URL = process.env.VUE_APP_BACKEND_URL || 'http://localhost:8080'

export const redirectToGoogle = () => {
  // Spring Security OAuth2 엔드포인트로 직접 리다이렉트
  // 프록시를 거치지 않고 직접 백엔드로 가야 세션 쿠키가 제대로 전달됨
  // OAuth2 로그인은 반드시 브라우저 직접 리다이렉트로 해야 함 (AJAX 불가)
  const oauthUrl = `${BACKEND_URL}/oauth2/authorization/google`
  console.log('OAuth2 로그인 시작:', oauthUrl)
  window.location.href = oauthUrl
}

