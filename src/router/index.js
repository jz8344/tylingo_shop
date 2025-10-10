import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/fortnite',
      name: 'Fortnite',
      component: () => import('@/views/Fortnite.vue')
    },
    {
      path: '/callofduty',
      name: 'CallOfDuty',
      component: () => import('@/views/CallOfDuty.vue')
    },
    {
      path: '/digital-coins',
      name: 'DigitalCoins',
      component: () => import('@/views/DigitalCoins.vue')
    },
    {
      path: '/anime-skins',
      name: 'AnimeSkins',
      component: () => import('@/views/AnimeSkins.vue')
    },
    {
      path: '/disney-infinity',
      name: 'DisneyInfinity',
      component: () => import('@/views/DisneyInfinity.vue')
    },
    {
      path: '/events',
      name: 'Events',
      component: () => import('@/views/Events.vue')
    },
    {
      path: '/test-mercadopago',
      name: 'TestMercadoPago',
      component: () => import('@/views/TestMercadoPago.vue')
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('@/views/Cart.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/Search.vue')
    }
  ],
})

export default router
