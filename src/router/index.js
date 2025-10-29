import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import MainPage from '../pages/MainPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import NoHeaderLayout from '../components/Layout/NoHeaderLayout.vue'
import MainLayout from '../components/Layout/MainLayout.vue'

const routes = [
  {
    path: '/login',
    component: NoHeaderLayout,
    children: [
      { path: '', name: 'Login', component: LoginPage }
    ]
  },
  {
    path: '/signup',
    component: NoHeaderLayout,
    children: [
      { path: '', name: 'SignUp', component: LoginPage }
    ]
  },
  {
    path: '/users/profile',
    component: NoHeaderLayout,
    children: [
      { path: '', name: 'Profile', component: ProfilePage }
    ]
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Home', component: MainPage }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 토큰 기반 라우터 가드
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')
  const isAuthRoute = to.path === '/login' || to.path === '/signup'
  const needsAuth = to.path.startsWith('/users/')

  if (token && isAuthRoute) {
    return next('/users/profile')
  }
  if (needsAuth && !token) {
    return next('/login')
  }
  return next()
})

export default router
