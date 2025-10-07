<template>
  <!-- Header UNSC -->
  <header class="sticky top-0 z-50 glass-header">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo (link to home) -->
        <router-link to="/" class="flex items-center space-x-3 group">
          <div class="w-12 h-12 glass-card flex items-center justify-center unsc-hover">
            <i data-feather="zap" class="text-unsc w-10 h-10"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold unsc-title group-hover:opacity-90">Game Shop</h1>
            <p class="text-xs text-blue-300 uppercase tracking-wider">Autorizado</p>
          </div>
        </router-link>
        
        <!-- Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <nav class="flex space-x-6">
            <router-link to="/" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
              <i data-feather="home" class="w-4 h-4 mr-2"></i>
              Inicio
            </router-link>
            <router-link to="/fortnite" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
              <i data-feather="gamepad-2" class="w-4 h-4 mr-2"></i>
              Fortnite
            </router-link>
            <router-link to="/callofduty" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
              <i data-feather="target" class="w-4 h-4 mr-2"></i>
              Call of Duty
            </router-link>
            <router-link to="/login" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
              <i data-feather="user" class="w-4 h-4 mr-2"></i>
              Login
            </router-link>
          </nav>
          
          <!-- Search Terminal -->
          <div class="relative">
            <input 
              type="text" 
              placeholder="BUSCAR EQUIPO..." 
              class="input-unsc rounded-lg py-2 px-4 pl-10 w-64 text-sm uppercase"
              v-model="searchQuery"
              @keyup.enter="search"
            >
            <i data-feather="search" class="absolute left-3 top-2.5 text-unsc w-4 h-4"></i>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <button class="p-2 text-blue-200 hover:text-unsc transition relative" @click="toggleFavorites">
            <i data-feather="bookmark"></i>
            <span v-if="favoritesCount > 0" class="absolute -top-1 -right-1 bg-unsc text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {{ favoritesCount }}
            </span>
          </button>
          <button @click="toggleCart" class="p-2 text-blue-200 hover:text-unsc transition relative">
            <i data-feather="package"></i>
            <span v-show="cartCount > 0" class="absolute -top-1 -right-1 bg-unsc text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {{ cartCount }}
            </span>
          </button>
          <button class="md:hidden p-2 text-blue-200 hover:text-unsc transition" @click="toggleMobileMenu">
            <i data-feather="menu"></i>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden mt-4 glass-card p-4 rounded-lg">
        <nav class="flex flex-col space-y-3">
          <router-link to="/" @click="toggleMobileMenu" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
            <i data-feather="home" class="w-4 h-4 mr-2"></i>
            Inicio
          </router-link>
          <router-link to="/fortnite" @click="toggleMobileMenu" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
            <i data-feather="gamepad-2" class="w-4 h-4 mr-2"></i>
            Fortnite
          </router-link>
          <router-link to="/callofduty" @click="toggleMobileMenu" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
            <i data-feather="target" class="w-4 h-4 mr-2"></i>
            Call of Duty
          </router-link>
          <router-link to="/login" @click="toggleMobileMenu" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
            <i data-feather="user" class="w-4 h-4 mr-2"></i>
            Login
          </router-link>
        </nav>
        
        <!-- Mobile Search -->
        <div class="relative mt-4">
          <input 
            type="text" 
            placeholder="BUSCAR EQUIPO..." 
            class="input-unsc rounded-lg py-2 px-4 pl-10 w-full text-sm uppercase"
            v-model="searchQuery"
            @keyup.enter="search"
          >
          <i data-feather="search" class="absolute left-3 top-2.5 text-unsc w-4 h-4"></i>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const showMobileMenu = ref(false)
    const favoritesCount = ref(3) // Ejemplo, debería venir de un store
    const cartCount = ref(0) // Ejemplo, debería venir de un store

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value
    }

    const toggleCart = () => {
      // Implementar lógica del carrito
      console.log('Toggle cart')
    }

    const toggleFavorites = () => {
      // Implementar lógica de favoritos
      console.log('Toggle favorites')
    }

    const search = () => {
      if (searchQuery.value.trim()) {
        // Implementar lógica de búsqueda
        console.log('Searching for:', searchQuery.value)
        router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
      }
    }

    onMounted(() => {
      // Inicializar iconos de Feather
      if (window.feather) {
        window.feather.replace()
      }
    })

    return {
      searchQuery,
      showMobileMenu,
      favoritesCount,
      cartCount,
      toggleMobileMenu,
      toggleCart,
      toggleFavorites,
      search
    }
  }
}
</script>