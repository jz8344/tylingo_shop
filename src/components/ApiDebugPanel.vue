<template>
  <div v-if="showDebug" class="fixed bottom-4 right-4 glass-card p-4 text-xs z-50 max-w-sm">
    <div class="flex items-center justify-between mb-2">
      <h3 class="font-bold text-blue-300">🔍 API Debug Info</h3>
      <button @click="closeDebug" class="text-red-400 hover:text-red-300">
        <i data-feather="x" class="w-4 h-4"></i>
      </button>
    </div>
    
    <div class="space-y-1 text-blue-100">
      <div><strong>Frontend Host:</strong> {{ frontendHost }}</div>
      <div><strong>Frontend URL:</strong> {{ frontendUrl }}</div>
      <div><strong>API URL:</strong> {{ apiUrl }}</div>
      <div><strong>Environment:</strong> {{ environment }}</div>
      <div><strong>Node Env:</strong> {{ nodeEnv }}</div>
    </div>

    <div class="mt-3 pt-3 border-t border-blue-500/30">
      <button 
        @click="testConnection" 
        :disabled="testing"
        class="btn-unsc px-3 py-1 text-xs w-full"
      >
        {{ testing ? '🔄 Probando...' : '🧪 Probar Conexión' }}
      </button>
      
      <div v-if="testResult" class="mt-2 p-2 rounded" :class="testResult.success ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'">
        {{ testResult.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const showDebug = ref(false)
const testing = ref(false)
const testResult = ref(null)

const frontendHost = computed(() => {
  return typeof window !== 'undefined' ? window.location.hostname : 'N/A'
})

const frontendUrl = computed(() => {
  return typeof window !== 'undefined' ? window.location.origin : 'N/A'
})

const apiUrl = computed(() => {
  return api.API_URL
})

const environment = computed(() => {
  return import.meta.env.MODE
})

const nodeEnv = computed(() => {
  return import.meta.env.PROD ? 'production' : 'development'
})

const closeDebug = () => {
  showDebug.value = false
  localStorage.setItem('hideApiDebug', 'true')
}

const testConnection = async () => {
  testing.value = true
  testResult.value = null
  
  try {
    // Intentar hacer una petición de prueba
    const response = await fetch(apiUrl.value.replace('/api/v1', '/api/health'))
    
    if (response.ok) {
      testResult.value = {
        success: true,
        message: '✅ Conexión exitosa con la API'
      }
    } else {
      testResult.value = {
        success: false,
        message: `❌ Error: ${response.status} ${response.statusText}`
      }
    }
  } catch (error) {
    testResult.value = {
      success: false,
      message: `❌ Error: ${error.message}`
    }
  } finally {
    testing.value = false
  }
}

onMounted(() => {
  // Mostrar debug solo en desarrollo y si no se ha ocultado
  const hideDebug = localStorage.getItem('hideApiDebug')
  if (import.meta.env.DEV && !hideDebug) {
    showDebug.value = true
  }

  // Permitir mostrar con Ctrl+Shift+D
  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      showDebug.value = !showDebug.value
      localStorage.removeItem('hideApiDebug')
    }
  }
  
  window.addEventListener('keydown', handleKeyPress)
  
  // Inicializar iconos de Feather
  if (window.feather) {
    setTimeout(() => window.feather.replace(), 100)
  }
})
</script>

<style scoped>
.btn-unsc:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>




