import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/guide',
    name: 'Guide',
    component: () => import('../views/Guide.vue'),
  },
/*  {
    path: '/shop',
    name: 'Shop',
    component: () => import('../views/Shop.vue'),
  }, */
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
  },
  {
    path: '/hotel-detail/:id',
    name: 'HotelDetail',
    component: () => import('../views/HotelDetail.vue'),
  },
  {
    path: '/guide-detail/:id',
    name: 'GuideDetail',
    component: () => import('../views/GuideDetail.vue'),
  },
  {
    path: '/scenic-detail',
    name: 'ScenicDetail',
    component: () => import('../views/ScenicDetail.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue'),
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('../views/Feedback.vue'),
  },
  {
    path: '/my-feedback',
    name: 'MyFeedback',
    component: () => import('../views/MyFeedback.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
