<template>
  <div id="app" class="bg-black text-gray-200 font-orbitron min-h-screen">
    <!-- UNSC Loader -->
    <div v-if="isLoading" id="unsc-loader" class="unsc-loader">
      <div class="flex flex-col items-center gap-4">
        <div class="loader-ring"></div>
        <div class="text-unsc text-sm uppercase tracking-wider">INICIALIZANDO...</div>
      </div>
    </div>

    <!-- Main App Content -->
    <div v-show="!isLoading">
      <Navbar />
      <main>
        <router-view />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  setup() {
    const isLoading = ref(true)

    onMounted(() => {
      // Simular tiempo de carga
      setTimeout(() => {
        isLoading.value = false
      }, 2500)

      // Inicializar iconos de Feather
      if (window.feather) {
        window.feather.replace()
      }
    })

    return {
      isLoading
    }
  }
}
</script>

<style>
/* Global styles - will be moved to styles folder */
</style>
