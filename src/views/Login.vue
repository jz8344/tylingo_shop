<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4 max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-6 unsc-title">ACCESO RESTRINGIDO</h1>
        <p class="text-blue-200">Ingresa tus credenciales para acceder al sistema UNSC</p>
      </div>
      
      <div class="glass-card p-8">
        <form @submit.prevent="handleLogin">
          <div class="mb-6">
            <label class="block text-blue-200 text-sm font-bold mb-2 uppercase tracking-wider">
              Usuario UNSC
            </label>
            <input 
              v-model="form.username"
              type="text" 
              class="input-unsc w-full py-3 px-4 rounded-lg"
              placeholder="Ingresa tu usuario"
              required
            >
          </div>
          
          <div class="mb-6">
            <label class="block text-blue-200 text-sm font-bold mb-2 uppercase tracking-wider">
              Contraseña
            </label>
            <input 
              v-model="form.password"
              type="password" 
              class="input-unsc w-full py-3 px-4 rounded-lg"
              placeholder="Ingresa tu contraseña"
              required
            >
          </div>
          
          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center text-blue-300">
              <input type="checkbox" class="mr-2" v-model="form.remember">
              <span class="text-sm">Recordar sesión</span>
            </label>
            <a href="#" class="text-unsc text-sm hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
          
          <button 
            type="submit" 
            class="btn-unsc w-full py-3 px-4 rounded-lg text-lg font-bold uppercase tracking-wider"
            :disabled="isLoading"
          >
            <i data-feather="lock" class="inline w-5 h-5 mr-2"></i>
            {{ isLoading ? 'VERIFICANDO...' : 'INICIAR SESIÓN' }}
          </button>
        </form>
        
        <div class="mt-8 pt-6 border-t border-unsc/30 text-center">
          <p class="text-blue-300 text-sm mb-4">¿No tienes cuenta?</p>
          <button class="text-unsc hover:underline font-bold uppercase text-sm tracking-wider">
            SOLICITAR ACCESO
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const isLoading = ref(false)
    const form = ref({
      username: '',
      password: '',
      remember: false
    })

    const handleLogin = async () => {
      isLoading.value = true
      
      // Simular proceso de login
      setTimeout(() => {
        console.log('Login attempt:', form.value)
        isLoading.value = false
        // Aquí iría la lógica real de autenticación
        // router.push('/')
      }, 2000)
    }

    onMounted(() => {
      if (window.feather) {
        window.feather.replace()
      }
    })

    return {
      form,
      isLoading,
      handleLogin
    }
  }
}
</script>