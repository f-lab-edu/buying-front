import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import MainPage from '../pages/MainPage.vue'
import NoHeaderLayout from '../components/Layout/NoHeaderLayout.vue'
import MainLayout from '../components/Layout/MainLayout.vue'

const routes = [
  {
    path: '/login',
    component: NoHeaderLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: LoginPage
      }
    ]
  },
  {
    path: '/signup',
    component: NoHeaderLayout,
    children: [
      {
        path: '',
        name: 'SignUp',
        component: LoginPage
      }
    ]
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: MainPage
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
