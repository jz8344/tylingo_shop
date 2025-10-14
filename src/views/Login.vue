<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4 max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-6 unsc-title">ACCESO RESTRINGIDO</h1>
        <p class="text-blue-200">Ingresa tus credenciales para acceder al sistema UNSC</p>
      </div>

      <!-- Mensaje de éxito -->
      <div v-if="successMessage" class="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg">
        <div class="flex items-center">
          <i data-feather="check-circle" class="w-5 h-5 text-green-400 mr-2"></i>
          <span class="text-green-100">{{ successMessage }}</span>
        </div>
      </div>

      <!-- Mensaje de error general -->
      <div v-if="hasGeneralError" class="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
        <div class="flex items-center">
          <i data-feather="alert-circle" class="w-5 h-5 text-red-400 mr-2"></i>
          <span class="text-red-100">{{ generalError }}</span>
        </div>
      </div>
      
      <div class="glass-card p-8">
        <form @submit.prevent="handleLogin" @input="clearMessages">
          <div class="mb-6">
            <label class="block text-blue-200 text-sm font-bold mb-2 uppercase tracking-wider">
              Usuario UNSC
            </label>
            <input 
              v-model="form.username"
              type="text" 
              :class="['input-unsc w-full py-3 px-4 rounded-lg', hasError('username') ? 'border-red-500 focus:border-red-500' : '']"
              placeholder="Ingresa tu usuario o email"
              @input="clearFieldError('username')"
              :disabled="isLoading"
            >
            <div v-if="hasError('username')" class="mt-2 text-red-400 text-sm">
              <i data-feather="alert-circle" class="inline w-4 h-4 mr-1"></i>
              {{ getError('username') }}
            </div>
          </div>
          
          <div class="mb-6">
            <label class="block text-blue-200 text-sm font-bold mb-2 uppercase tracking-wider">
              Contraseña
            </label>
            <div class="relative">
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'" 
                :class="['input-unsc w-full py-3 px-4 pr-12 rounded-lg', hasError('password') ? 'border-red-500 focus:border-red-500' : '']"
                placeholder="Ingresa tu contraseña"
                @input="clearFieldError('password')"
                :disabled="isLoading"
              >
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300 hover:text-unsc transition-colors"
                :disabled="isLoading"
              >
                <i :data-feather="showPassword ? 'eye-off' : 'eye'" class="w-5 h-5"></i>
              </button>
            </div>
            <div v-if="hasError('password')" class="mt-2 text-red-400 text-sm">
              <i data-feather="alert-circle" class="inline w-4 h-4 mr-1"></i>
              {{ getError('password') }}
            </div>
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
          <button 
            type="button"
            @click="goToRegister"
            class="text-unsc hover:underline font-bold uppercase text-sm tracking-wider transition-colors"
            :disabled="isLoading"
          >
            CREAR CUENTA UNSC
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = ref({
      username: '',
      password: '',
      remember: false
    })
    
    const errors = ref({})
    const successMessage = ref('')
    const showPassword = ref(false)

    // Computed para controlar el estado de carga
    const isLoading = computed(() => authStore.isLoading)

    // Limpiar errores cuando el usuario escriba
    const clearFieldError = (field) => {
      if (errors.value[field]) {
        delete errors.value[field]
      }
    }

    // Limpiar todos los errores y mensajes
    const clearMessages = () => {
      errors.value = {}
      successMessage.value = ''
      authStore.clearError()
    }

    // Validación del formulario del lado del cliente
    const validateForm = () => {
      const newErrors = {}

      if (!form.value.username.trim()) {
        newErrors.username = 'El usuario es obligatorio'
      } else if (form.value.username.length < 3) {
        newErrors.username = 'El usuario debe tener al menos 3 caracteres'
      }

      if (!form.value.password) {
        newErrors.password = 'La contraseña es obligatoria'
      } else if (form.value.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
      }

      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }

    // Manejar el login
    const handleLogin = async () => {
      console.log('🔑 Iniciando proceso de login...')
      clearMessages()

      // Validación del lado del cliente
      if (!validateForm()) {
        console.log('❌ Validación del formulario falló')
        return
      }

      try {
        // Preparar credenciales
        const credentials = {
          username: form.value.username.trim(),
          password: form.value.password,
          revoke_previous_tokens: !form.value.remember // Si no quiere recordar, revocar tokens anteriores
        }

        // Intentar login a través del store
        const result = await authStore.login(credentials)

        if (result.success) {
          successMessage.value = result.message || '¡Bienvenido al sistema UNSC!'
          console.log('✅ Login exitoso, redirigiendo...')
          
          // Redirigir después de un breve delay para mostrar el mensaje
          setTimeout(() => {
            const redirectTo = router.currentRoute.value.query.redirect || '/'
            router.push(redirectTo)
          }, 1000)

        } else {
          console.log('❌ Login falló:', result.message)
          
          // Manejar errores específicos
          if (result.errors) {
            errors.value = result.errors
          } else {
            // Error general
            errors.value = { general: result.message || 'Error en el login' }
          }

          // Limpiar contraseña si hay error de credenciales
          if (result.status === 401) {
            form.value.password = ''
          }
        }

      } catch (error) {
        console.error('❌ Error inesperado en login:', error)
        errors.value = { general: 'Error de conexión. Verifica tu internet.' }
      }
    }

    // Navegar al registro
    const goToRegister = () => {
      router.push('/signup')
    }

    // Redireccionar si ya está autenticado
    onMounted(() => {
      if (window.feather) {
        window.feather.replace()
      }

      // Si ya está autenticado, redirigir
      if (authStore.isAuthenticated) {
        console.log('✅ Usuario ya autenticado, redirigiendo...')
        router.push('/')
      }
    })

    // Actualizar iconos de Feather cuando cambie showPassword
    watch(showPassword, async () => {
      await nextTick()
      if (window.feather) {
        window.feather.replace()
      }
    })

    return {
      form,
      errors,
      successMessage,
      isLoading,
      showPassword,
      handleLogin,
      goToRegister,
      clearFieldError,
      clearMessages,
      
      // Helpers para el template
      hasError: (field) => !!errors.value[field],
      getError: (field) => errors.value[field],
      hasGeneralError: computed(() => !!errors.value.general),
      generalError: computed(() => errors.value.general)
    }
  }
}
</script>