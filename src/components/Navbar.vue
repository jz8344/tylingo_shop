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
            <i data-feather="play-circle" class="mr-2 w-4"></i>Disney Games
          </router-link>
          <router-link to="/another-games" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="grid" class="mr-2 w-4"></i>Otros Juegos
          </router-link>
          <router-link to="/events" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="map-pin" class="mr-2 w-4"></i>Eventos
          </router-link>
          <router-link to="/cart" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center relative">
            <i data-feather="shopping-cart" class="mr-2 w-4"></i>Carrito
            <span v-if="cartItemCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {{ cartItemCount }}
            </span>
          </router-link>
          
          <!-- Usuario no autenticado -->
          <div v-if="!isAuthenticated" class="flex items-center space-x-4">
            <router-link to="/login" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
              <i data-feather="log-in" class="mr-2 w-4"></i>Login
            </router-link>
            <router-link to="/signup" class="btn-unsc-sm px-4 py-2 rounded uppercase text-xs font-bold">
              <i data-feather="user-plus" class="mr-1 w-3 h-3"></i>Registro
            </router-link>
          </div>

          <!-- Usuario autenticado -->
          <div v-else class="relative user-menu">
            <button 
              @click="toggleUserMenu"
              class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center space-x-2"
            >
              <i data-feather="user" class="w-4 h-4"></i>
              <span>{{ userName }}</span>
              <i v-if="isAdmin" data-feather="crown" class="w-4 h-4 text-yellow-400"></i>
              <i data-feather="chevron-down" class="w-4 h-4"></i>
            </button>

            <!-- Menú desplegable del usuario -->
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 glass-card rounded-lg shadow-xl z-50">
              <div class="py-2">
                <div class="px-4 py-2 border-b border-unsc/20">
                  <p class="text-sm text-blue-300">{{ userName }}</p>
                  <p class="text-xs text-blue-400 capitalize">{{ isAdmin ? 'Administrador' : 'Usuario' }}</p>
                </div>
                
                <router-link 
                  to="/profile" 
                  @click="closeMenus"
                  class="block px-4 py-2 text-sm text-blue-200 hover:text-cyan-300 hover:bg-unsc/10 flex items-center"
                >
                  <i data-feather="user" class="mr-2 w-4 h-4"></i>
                  Mi Perfil
                </router-link>
                
                <router-link 
                  to="/orders" 
                  @click="closeMenus"
                  class="block px-4 py-2 text-sm text-blue-200 hover:text-cyan-300 hover:bg-unsc/10 flex items-center"
                >
                  <i data-feather="package" class="mr-2 w-4 h-4"></i>
                  Mis Pedidos
                </router-link>

                <div v-if="isAdmin" class="border-t border-unsc/20">
                  <router-link 
                    to="/admin" 
                    @click="closeMenus"
                    class="block px-4 py-2 text-sm text-yellow-300 hover:text-yellow-200 hover:bg-unsc/10 flex items-center"
                  >
                    <i data-feather="settings" class="mr-2 w-4 h-4"></i>
                    Panel Admin
                  </router-link>
                </div>

                <div class="border-t border-unsc/20">
                  <button 
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 flex items-center"
                  >
                    <i data-feather="log-out" class="mr-2 w-4 h-4"></i>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        <div class="flex items-center space-x-4">
          <button class="md:hidden p-2 text-blue-200 hover:text-cyan-300 transition" @click="toggleMobileMenu">
            <i data-feather="menu"></i>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden mt-4 glass-card p-4 rounded-lg mobile-menu">
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
            <i data-feather="zap" class="mr-2 w-4"></i>Disney Games
          </router-link>
          <router-link to="/another-games" @click="toggleMobileMenu" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="grid" class="mr-2 w-4"></i>Otros Juegos
          </router-link>
          <router-link to="/events" @click="toggleMobileMenu" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
            <i data-feather="map-pin" class="mr-2 w-4"></i>Eventos
          </router-link>
          <router-link to="/cart" @click="toggleMobileMenu" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center relative">
            <i data-feather="shopping-cart" class="mr-2 w-4"></i>Carrito
            <span v-if="cartItemCount > 0" class="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {{ cartItemCount }}
            </span>
          </router-link>
          
          <!-- Sección de autenticación mobile -->
          <div class="border-t border-unsc/30 pt-3 mt-3">
            <div v-if="!isAuthenticated" class="space-y-3">
              <router-link to="/login" @click="toggleMobileMenu" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
                <i data-feather="log-in" class="mr-2 w-4"></i>Login
              </router-link>
              <router-link to="/signup" @click="toggleMobileMenu" class="text-unsc hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
                <i data-feather="user-plus" class="mr-2 w-4"></i>Registro
              </router-link>
            </div>

            <div v-else class="space-y-3">
              <div class="text-blue-300 text-sm border-b border-unsc/20 pb-2">
                <p class="font-bold">{{ userName }}</p>
                <p class="text-xs text-blue-400 capitalize">{{ isAdmin ? 'Administrador' : 'Usuario' }}</p>
              </div>
              
              <router-link to="/profile" @click="toggleMobileMenu" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
                <i data-feather="user" class="mr-2 w-4"></i>Mi Perfil
              </router-link>
              
              <router-link to="/orders" @click="toggleMobileMenu" class="text-blue-200 hover:text-cyan-300 uppercase text-sm font-bold flex items-center">
                <i data-feather="package" class="mr-2 w-4"></i>Mis Pedidos
              </router-link>

              <router-link v-if="isAdmin" to="/admin" @click="toggleMobileMenu" class="text-yellow-300 hover:text-yellow-200 uppercase text-sm font-bold flex items-center">
                <i data-feather="settings" class="mr-2 w-4"></i>Panel Admin
              </router-link>

              <button @click="handleLogout" class="w-full text-left text-red-300 hover:text-red-200 uppercase text-sm font-bold flex items-center">
                <i data-feather="log-out" class="mr-2 w-4"></i>Cerrar Sesión
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    const authStore = useAuthStore()
    const showMobileMenu = ref(false)
    const showUserMenu = ref(false)

    const cartItemCount = computed(() => cartStore.itemCount)
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const userName = computed(() => authStore.userName)
    const isAdmin = computed(() => authStore.isAdmin)

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value
    }

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    const handleLogout = async () => {
      console.log('🚪 Navbar: Iniciando logout...')
      showUserMenu.value = false
      showMobileMenu.value = false
      
      try {
        await authStore.logout()
        console.log('✅ Navbar: Logout exitoso')
        router.push('/')
      } catch (error) {
        console.error('❌ Navbar: Error en logout:', error)
      }
    }

    // Cerrar menús al hacer clic fuera
    const closeMenus = () => {
      showUserMenu.value = false
      showMobileMenu.value = false
    }

    onMounted(() => {
      // Inicializar iconos de Feather
      if (window.feather) {
        window.feather.replace()
      }

      // Cerrar menús al hacer clic fuera
      document.addEventListener('click', (event) => {
        const userMenu = document.querySelector('.user-menu')
        const mobileMenu = document.querySelector('.mobile-menu')
        
        if (userMenu && !userMenu.contains(event.target)) {
          showUserMenu.value = false
        }
        if (mobileMenu && !mobileMenu.contains(event.target)) {
          showMobileMenu.value = false
        }
      })
    })

    return {
      showMobileMenu,
      showUserMenu,
      cartItemCount,
      isAuthenticated,
      userName,
      isAdmin,
      toggleMobileMenu,
      toggleUserMenu,
      handleLogout,
      closeMenus
    }
  }
}
</script>