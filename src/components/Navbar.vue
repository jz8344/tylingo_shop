<template>
  <!-- Header UNSC -->
  <header class="sticky top-0 z-50 glass-header">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo (link to home) -->
        <router-link to="/" class="flex items-center space-x-3">
          <div class="w-12 h-12 glass-card flex items-center justify-center">
            <i data-feather="zap" class="text-cyan-300"></i>
          </div>
          <span class="text-xl font-bold unsc-title hidden sm:block">GAME SHOP</span>
        </router-link>
        
        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <router-link to="/" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="home" class="mr-2 w-4"></i>Inicio
          </router-link>
          <router-link to="/fortnite" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="target" class="mr-2 w-4"></i>Fortnite
          </router-link>
          <router-link to="/callofduty" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="crosshair" class="mr-2 w-4"></i>Call of Duty
          </router-link>
          <router-link to="/digital-coins" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="dollar-sign" class="mr-2 w-4"></i>Monedas Digitales
          </router-link>
          <router-link to="/anime-skins" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="star" class="mr-2 w-4"></i>Anime Skins
          </router-link>
          <router-link to="/disney-infinity" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="zap" class="mr-2 w-4"></i>Disney Infinity
          </router-link>
          <router-link to="/cart" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center relative">
            <i data-feather="shopping-cart" class="mr-2 w-4"></i>Carrito
            <span v-if="cartItemCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {{ cartItemCount }}
            </span>
          </router-link>
          <router-link to="/login" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="user" class="mr-2 w-4"></i>Login
          </router-link>
        </nav>
        
        <div class="flex items-center space-x-4">
          <button class="md:hidden p-2 text-blue-200 hover:text-cyan-300 transition" @click="toggleMobileMenu">
            <i data-feather="menu"></i>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden mt-4 glass-card p-4 rounded-lg">
        <nav class="flex flex-col space-y-3">
          <router-link to="/" @click="toggleMobileMenu" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="home" class="mr-2 w-4"></i>Inicio
          </router-link>
          <router-link to="/fortnite" @click="toggleMobileMenu" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="target" class="mr-2 w-4"></i>Fortnite
          </router-link>
          <router-link to="/callofduty" @click="toggleMobileMenu" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="crosshair" class="mr-2 w-4"></i>Call of Duty
          </router-link>
          <router-link to="/digital-coins" @click="toggleMobileMenu" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="dollar-sign" class="mr-2 w-4"></i>Monedas Digitales
          </router-link>
          <router-link to="/anime-skins" @click="toggleMobileMenu" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="star" class="mr-2 w-4"></i>Anime Skins
          </router-link>
          <router-link to="/disney-infinity" @click="toggleMobileMenu" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="zap" class="mr-2 w-4"></i>Disney Infinity
          </router-link>
          <router-link to="/login" @click="toggleMobileMenu" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="user" class="mr-2 w-4"></i>Login
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    const showMobileMenu = ref(false)

    const cartItemCount = computed(() => cartStore.itemCount)

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value
    }

    onMounted(() => {
      // Inicializar iconos de Feather
      if (window.feather) {
        window.feather.replace()
      }
    })

    return {
      showMobileMenu,
      toggleMobileMenu,
      cartItemCount
    }
  }
}
</script>