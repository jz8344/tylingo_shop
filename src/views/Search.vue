<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-6 unsc-title">BÚSQUEDA DE EQUIPAMIENTO</h1>
        <p class="text-blue-200">Resultados para: "{{ searchQuery }}"</p>
      </div>
      
      <div class="glass-card p-8 text-center">
        <i data-feather="search" class="w-16 h-16 text-unsc mx-auto mb-4"></i>
        <h2 class="text-2xl font-bold text-blue-100 mb-4">Sistema de búsqueda</h2>
        <p class="text-blue-300 mb-6">Función de búsqueda en desarrollo. Pronto podrás buscar todos los productos disponibles.</p>
        
        <div class="max-w-md mx-auto">
          <div class="relative">
            <input 
              v-model="newSearch"
              type="text" 
              placeholder="BUSCAR PRODUCTOS..." 
              class="input-unsc rounded-lg py-3 px-4 pl-12 w-full uppercase"
              @keyup.enter="performSearch"
            >
            <i data-feather="search" class="absolute left-4 top-3.5 text-unsc w-5 h-5"></i>
          </div>
          <button 
            @click="performSearch"
            class="btn-unsc px-6 py-3 rounded-lg mt-4 w-full"
          >
            BUSCAR
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'Search',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const searchQuery = ref(route.query.q || '')
    const newSearch = ref('')

    const performSearch = () => {
      if (newSearch.value.trim()) {
        router.push(`/search?q=${encodeURIComponent(newSearch.value)}`)
        searchQuery.value = newSearch.value
        newSearch.value = ''
      }
    }

    onMounted(() => {
      if (window.feather) {
        window.feather.replace()
      }
    })

    return {
      searchQuery,
      newSearch,
      performSearch
    }
  }
}
</script>