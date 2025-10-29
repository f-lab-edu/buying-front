// 구글 OAuth 설정
// 구글 콘솔에서 발급받은 Client ID를 여기에 입력하세요
// 방법 1: .env 파일에 VUE_APP_GOOGLE_CLIENT_ID 설정
// 방법 2: 아래 DIRECT_CLIENT_ID에 직접 입력 (환경변수보다 우선)
const DIRECT_CLIENT_ID = '' // 여기에 구글 Client ID를 직접 입력할 수 있습니다

export const GOOGLE_OAUTH_CONFIG = {
  clientId: DIRECT_CLIENT_ID || process.env.VUE_APP_GOOGLE_CLIENT_ID || '',
  redirectUri: process.env.VUE_APP_GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth/google/redirect',
  scope: 'openid email profile',
  responseType: 'code',
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
}

export const getGoogleAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.clientId,
    redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
    response_type: GOOGLE_OAUTH_CONFIG.responseType,
    scope: GOOGLE_OAUTH_CONFIG.scope,
    access_type: 'offline',
    prompt: 'consent'
  })
  
  return `${GOOGLE_OAUTH_CONFIG.authUrl}?${params.toString()}`
}

export const redirectToGoogle = () => {
  if (!GOOGLE_OAUTH_CONFIG.clientId) {
    console.error('Google Client ID가 설정되지 않았습니다. googleOAuth.js 파일에서 clientId를 설정해주세요.')
    alert('구글 로그인 설정이 완료되지 않았습니다. 관리자에게 문의해주세요.')
    return
  }
  const url = getGoogleAuthUrl()
  window.location.href = url
}

