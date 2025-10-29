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
    console.log('API 요청:', config.method.toUpperCase(), config.url, config.data)
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
    console.log('API 응답:', response.status, response.config.url, response.data)
    return response
  },
  (error) => {
    console.error('API 에러:', error.response?.status, error.config?.url, error.response?.data)
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
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
