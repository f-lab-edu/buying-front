import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import MainPage from '../pages/MainPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import GoogleOAuthRedirect from '../pages/GoogleOAuthRedirect.vue'
import PostCreatePage from '../pages/PostCreatePage.vue'
import PostDetailPage from '../pages/PostDetailPage.vue'
import NoHeaderLayout from '../components/Layout/NoHeaderLayout.vue'
import MainLayout from '../components/Layout/MainLayout.vue'
import SellLayout from '../components/Layout/SellLayout.vue'
import DetailLayout from '../components/Layout/DetailLayout.vue'

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
    path: '/oauth/google/redirect',
    component: NoHeaderLayout,
    children: [
      { path: '', name: 'GoogleOAuthRedirect', component: GoogleOAuthRedirect }
    ]
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Home', component: MainPage }
    ]
  },
  {
    path: '/posts/create',
    component: SellLayout,
    children: [
      { path: '', name: 'PostCreate', component: PostCreatePage }
    ]
  },
  {
    path: '/posts/:id',
    component: DetailLayout,
    children: [
      { path: '', name: 'PostDetail', component: PostDetailPage }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')
  const isAuthRoute = to.path === '/login' || to.path === '/signup'
  const needsAuth = to.path.startsWith('/users/') || to.path === '/posts/create'

  if (token && isAuthRoute) {
    return next('/users/profile')
  }
  if (needsAuth && !token) {
    return next('/login')
  }
  return next()
})

export default router
