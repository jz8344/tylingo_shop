import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { useAuthStore } from '@/stores/auth.js'

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
      component: () => import('@/views/Login.vue'),
      meta: { 
        guest: true, 
        title: 'Iniciar Sesión' 
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('@/views/Signup.vue'),
      meta: { 
        guest: true, 
        title: 'Crear Cuenta' 
      }
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/Search.vue')
    }
  ],
})

// 🛡️ Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  console.log(`🔄 Navegando de ${from.path} a ${to.path}`)
  console.log(`👤 Autenticado: ${authStore.isAuthenticated}, Admin: ${authStore.isAdmin}`)

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('🚫 Ruta protegida, redirigiendo a login')
    next({ 
      name: 'Login', 
      query: { redirect: to.fullPath } 
    })
    return
  }

  // Si la ruta requiere ser admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    console.log('🚫 Ruta de admin, acceso denegado')
    next({ name: 'Home' })
    return
  }

  // Si es una ruta para invitados y ya está autenticado
  if (to.meta.guest && authStore.isAuthenticated) {
    console.log('ℹ️ Usuario autenticado en ruta de invitado, redirigiendo a home')
    next({ name: 'Home' })
    return
  }

  // Continuar con la navegación
  next()
})

export default router
