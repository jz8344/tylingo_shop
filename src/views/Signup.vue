<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4 max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-6 unsc-title">REGISTRO UNSC</h1>
        <p class="text-blue-200">Únete al sistema de comando naval espacial</p>
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
        <form @submit.prevent="handleRegister" @input="clearMessages">
          <!-- Nombre completo -->
          <div class="mb-6">
            <label class="block text-blue-200 text-sm font-bold mb-2 uppercase tracking-wider">
              Nombre Completo
            </label>
            <input 
              v-model="form.name"
              type="text" 
              :class="['input-unsc w-full py-3 px-4 rounded-lg', hasError('name') ? 'border-red-500 focus:border-red-500' : '']"
              placeholder="Tu nombre completo"
              @input="clearFieldError('name')"
              :disabled="isLoading"
            >
            <div v-if="hasError('name')" class="mt-2 text-red-400 text-sm">
              <i data-feather="alert-circle" class="inline w-4 h-4 mr-1"></i>
              {{ getError('name') }}
            </div>
          </div>

          <!-- Username -->
          <div class="mb-6">
            <label class="block text-blue-200 text-sm font-bold mb-2 uppercase tracking-wider">
              Usuario UNSC
            </label>
            <input 
              v-model="form.username"
              type="text" 
              :class="['input-unsc w-full py-3 px-4 rounded-lg', hasError('username') ? 'border-red-500 focus:border-red-500' : '']"
              placeholder="Nombre de usuario único"
              @input="clearFieldError('username')"
              :disabled="isLoading"
            >
            <div v-if="hasError('username')" class="mt-2 text-red-400 text-sm">
              <i data-feather="alert-circle" class="inline w-4 h-4 mr-1"></i>
              {{ getError('username') }}
            </div>
            <p class="mt-1 text-blue-300 text-xs">Mínimo 3 caracteres, solo letras, números y guiones</p>
          </div>

          <!-- Email -->
          <div class="mb-6">
            <label class="block text-blue-200 text-sm font-bold mb-2 uppercase tracking-wider">
              Email
            </label>
            <input 
              v-model="form.email"
              type="email" 
              :class="['input-unsc w-full py-3 px-4 rounded-lg', hasError('email') ? 'border-red-500 focus:border-red-500' : '']"
              placeholder="tu@email.com"
              @input="clearFieldError('email')"
              :disabled="isLoading"
            >
            <div v-if="hasError('email')" class="mt-2 text-red-400 text-sm">
              <i data-feather="alert-circle" class="inline w-4 h-4 mr-1"></i>
              {{ getError('email') }}
            </div>
          </div>
          
          <!-- Contraseña -->
          <div class="mb-6">
            <label class="block text-blue-200 text-sm font-bold mb-2 uppercase tracking-wider">
              Contraseña
            </label>
            <div class="relative">
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'" 
                :class="['input-unsc w-full py-3 px-4 pr-12 rounded-lg', hasError('password') ? 'border-red-500 focus:border-red-500' : '']"
                placeholder="Mínimo 8 caracteres"
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
            <!-- Indicador de fortaleza de contraseña -->
            <div v-if="form.password" class="mt-2">
              <div class="flex items-center space-x-2">
                <div class="flex-1 bg-gray-600 rounded-full h-1">
                  <div 
                    :class="[
                      'h-1 rounded-full transition-all duration-300',
                      passwordStrength.class
                    ]" 
                    :style="{ width: passwordStrength.width }"
                  ></div>
                </div>
                <span :class="['text-xs', passwordStrength.textClass]">
                  {{ passwordStrength.text }}
                </span>
              </div>
            </div>
          </div>

          <!-- Confirmar contraseña -->
          <div class="mb-6">
            <label class="block text-blue-200 text-sm font-bold mb-2 uppercase tracking-wider">
              Confirmar Contraseña
            </label>
            <div class="relative">
              <input 
                v-model="form.password_confirmation"
                :type="showPasswordConfirm ? 'text' : 'password'" 
                :class="['input-unsc w-full py-3 px-4 pr-12 rounded-lg', hasError('password_confirmation') ? 'border-red-500 focus:border-red-500' : '']"
                placeholder="Repite tu contraseña"
                @input="clearFieldError('password_confirmation')"
                :disabled="isLoading"
              >
              <button 
                type="button"
                @click="showPasswordConfirm = !showPasswordConfirm"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300 hover:text-unsc transition-colors"
                :disabled="isLoading"
              >
                <i :data-feather="showPasswordConfirm ? 'eye-off' : 'eye'" class="w-5 h-5"></i>
              </button>
            </div>
            <div v-if="hasError('password_confirmation')" class="mt-2 text-red-400 text-sm">
              <i data-feather="alert-circle" class="inline w-4 h-4 mr-1"></i>
              {{ getError('password_confirmation') }}
            </div>
            <!-- Indicador de coincidencia -->
            <div v-if="form.password_confirmation" class="mt-2">
              <div v-if="passwordsMatch" class="flex items-center text-green-400 text-xs">
                <i data-feather="check" class="w-3 h-3 mr-1"></i>
                Las contraseñas coinciden
              </div>
              <div v-else class="flex items-center text-red-400 text-xs">
                <i data-feather="x" class="w-3 h-3 mr-1"></i>
                Las contraseñas no coinciden
              </div>
            </div>
          </div>

          <!-- Términos y condiciones -->
          <div class="flex items-start mb-6">
            <input 
              type="checkbox" 
              v-model="form.acceptTerms"
              class="mr-3 mt-1" 
              :disabled="isLoading"
            >
            <label class="text-blue-300 text-sm">
              Acepto los 
              <a href="#" class="text-unsc hover:underline">términos y condiciones</a>
              del sistema UNSC y autorizo el procesamiento de mis datos.
            </label>
          </div>
          <div v-if="hasError('acceptTerms')" class="mb-6 text-red-400 text-sm">
            <i data-feather="alert-circle" class="inline w-4 h-4 mr-1"></i>
            {{ getError('acceptTerms') }}
          </div>
          
          <button 
            type="submit" 
            class="btn-unsc w-full py-3 px-4 rounded-lg text-lg font-bold uppercase tracking-wider"
            :disabled="isLoading || !formIsValid"
          >
            <i data-feather="user-plus" class="inline w-5 h-5 mr-2"></i>
            {{ isLoading ? 'REGISTRANDO...' : 'CREAR CUENTA UNSC' }}
          </button>
        </form>
        
        <div class="mt-8 pt-6 border-t border-unsc/30 text-center">
          <p class="text-blue-300 text-sm mb-4">¿Ya tienes cuenta?</p>
          <button 
            type="button"
            @click="goToLogin"
            class="text-unsc hover:underline font-bold uppercase text-sm tracking-wider transition-colors"
            :disabled="isLoading"
          >
            INICIAR SESIÓN
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
  name: 'Signup',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = ref({
      name: '',
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      acceptTerms: false
    })
    
    const errors = ref({})
    const successMessage = ref('')
    const showPassword = ref(false)
    const showPasswordConfirm = ref(false)

    // Computed para controlar el estado de carga
    const isLoading = computed(() => authStore.isLoading)

    // Validar fortaleza de contraseña
    const passwordStrength = computed(() => {
      const password = form.value.password
      if (!password) return { width: '0%', class: '', textClass: '', text: '' }

      let strength = 0
      let text = 'Muy débil'
      
      if (password.length >= 8) strength += 1
      if (/[a-z]/.test(password)) strength += 1
      if (/[A-Z]/.test(password)) strength += 1
      if (/\d/.test(password)) strength += 1
      if (/[^A-Za-z0-9]/.test(password)) strength += 1

      switch (strength) {
        case 0:
        case 1:
          return { 
            width: '20%', 
            class: 'bg-red-500', 
            textClass: 'text-red-400',
            text: 'Muy débil' 
          }
        case 2:
          return { 
            width: '40%', 
            class: 'bg-orange-500', 
            textClass: 'text-orange-400',
            text: 'Débil' 
          }
        case 3:
          return { 
            width: '60%', 
            class: 'bg-yellow-500', 
            textClass: 'text-yellow-400',
            text: 'Regular' 
          }
        case 4:
          return { 
            width: '80%', 
            class: 'bg-blue-500', 
            textClass: 'text-blue-400',
            text: 'Fuerte' 
          }
        case 5:
          return { 
            width: '100%', 
            class: 'bg-green-500', 
            textClass: 'text-green-400',
            text: 'Muy fuerte' 
          }
      }
    })

    // Verificar si las contraseñas coinciden
    const passwordsMatch = computed(() => {
      return form.value.password && 
             form.value.password_confirmation && 
             form.value.password === form.value.password_confirmation
    })

    // Verificar si el formulario es válido
    const formIsValid = computed(() => {
      return form.value.name.trim() &&
             form.value.username.trim() &&
             form.value.email.trim() &&
             form.value.password &&
             form.value.password_confirmation &&
             passwordsMatch.value &&
             form.value.acceptTerms &&
             Object.keys(errors.value).length === 0
    })

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

      // Validar nombre
      if (!form.value.name.trim()) {
        newErrors.name = 'El nombre es obligatorio'
      } else if (form.value.name.trim().length < 2) {
        newErrors.name = 'El nombre debe tener al menos 2 caracteres'
      }

      // Validar username
      if (!form.value.username.trim()) {
        newErrors.username = 'El usuario es obligatorio'
      } else if (form.value.username.length < 3) {
        newErrors.username = 'El usuario debe tener al menos 3 caracteres'
      } else if (!/^[a-zA-Z0-9_-]+$/.test(form.value.username)) {
        newErrors.username = 'Solo se permiten letras, números, guiones y guiones bajos'
      }

      // Validar email
      if (!form.value.email.trim()) {
        newErrors.email = 'El email es obligatorio'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        newErrors.email = 'El email debe tener un formato válido'
      }

      // Validar contraseña
      if (!form.value.password) {
        newErrors.password = 'La contraseña es obligatoria'
      } else if (form.value.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
      }

      // Validar confirmación de contraseña
      if (!form.value.password_confirmation) {
        newErrors.password_confirmation = 'Debes confirmar tu contraseña'
      } else if (form.value.password !== form.value.password_confirmation) {
        newErrors.password_confirmation = 'Las contraseñas no coinciden'
      }

      // Validar términos
      if (!form.value.acceptTerms) {
        newErrors.acceptTerms = 'Debes aceptar los términos y condiciones'
      }

      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }

    // Manejar el registro
    const handleRegister = async () => {
      console.log('📝 Iniciando proceso de registro...')
      clearMessages()

      // Validación del lado del cliente
      if (!validateForm()) {
        console.log('❌ Validación del formulario falló')
        return
      }

      try {
        // Preparar datos de registro
        const userData = {
          name: form.value.name.trim(),
          username: form.value.username.trim(),
          email: form.value.email.trim(),
          password: form.value.password,
          password_confirmation: form.value.password_confirmation
        }

        // Intentar registro a través del store
        const result = await authStore.register(userData)

        if (result.success) {
          successMessage.value = '¡Cuenta creada exitosamente! Redirigiendo...'
          console.log('✅ Registro exitoso, redirigiendo...')
          
          // Redirigir después de un breve delay para mostrar el mensaje
          setTimeout(() => {
            router.push('/')
          }, 2000)

        } else {
          console.log('❌ Registro falló:', result.message)
          
          // Manejar errores específicos
          if (result.errors) {
            errors.value = result.errors
          } else {
            // Error general
            errors.value = { general: result.message || 'Error en el registro' }
          }
        }

      } catch (error) {
        console.error('❌ Error inesperado en registro:', error)
        errors.value = { general: 'Error de conexión. Verifica tu internet.' }
      }
    }

    // Navegar al login
    const goToLogin = () => {
      router.push('/login')
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

    // Actualizar iconos de Feather cuando cambien los estados de mostrar contraseña
    watch([showPassword, showPasswordConfirm], async () => {
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
      showPasswordConfirm,
      passwordStrength,
      passwordsMatch,
      formIsValid,
      handleRegister,
      goToLogin,
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