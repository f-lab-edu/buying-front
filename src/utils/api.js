import axios from 'axios'

// axios 기본 설정
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 요청 인터셉터 - JWT 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('=== API 요청 정보 ===')
    console.log('Method:', config.method.toUpperCase())
    console.log('URL:', config.baseURL + config.url)
    console.log('전체 URL:', config.url)
    console.log('요청 데이터:', config.data)
    console.log('요청 헤더:', config.headers)
    console.log('===================')
    return config
  },
  (error) => {
    console.error('요청 에러:', error)
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => {
    console.log('=== API 응답 성공 ===')
    console.log('Status:', response.status)
    console.log('URL:', response.config.url)
    console.log('응답 데이터:', response.data)
    console.log('===================')
    return response
  },
  (error) => {
    console.error('=== API 에러 발생 ===')
    console.error('상태 코드:', error.response?.status)
    console.error('에러 URL:', error.config?.url)
    console.error('응답 데이터:', error.response?.data)
    console.error('요청 데이터:', error.config?.data)
    console.error('에러 메시지:', error.message)
    if (error.request) {
      console.error('요청 객체:', error.request)
    }
    console.error('===================')
    
    if (error.response?.status === 401 && error.config?.url !== '/member/login' && error.config?.url !== '/member/google/login') {
      // 토큰 만료 시 로그아웃 처리 (로그인/구글 로그인 제외)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('memberId')
      localStorage.removeItem('user')
      // 로그인 페이지로 리다이렉트
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
