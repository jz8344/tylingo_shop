/**
 * 🏪 Store Pinia de Autenticación
 * 
 * Maneja el estado global de autenticación en la aplicación
 * Incluye validación periódica de tokens y persistencia
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/authService.js'

export const useAuthStore = defineStore('auth', () => {
  // 🔄 Estado reactivo
  const user = ref(null)
  const token = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const tokenValidationInterval = ref(null)

  // ⚙️ Configuración
  const TOKEN_VALIDATION_INTERVAL = 5 * 60 * 1000 // 5 minutos en millisegundos

  // 📊 Getters computados
  const isAuthenticated = computed(() => {
    return !!(token.value && user.value)
  })

  const isAdmin = computed(() => {
    return user.value ? (user.value.is_admin || user.value.role === 'admin') : false
  })

  const userName = computed(() => {
    return user.value?.name || 'Usuario'
  })

  const userRole = computed(() => {
    return user.value?.role || 'user'
  })

  // 🧹 Limpiar error
  const clearError = () => {
    error.value = null
  }

  // 🔄 Inicializar desde localStorage
  const initializeAuth = () => {
    console.log('🔄 Inicializando autenticación...')
    
    // Cargar datos del localStorage
    const storedToken = authService.getToken()
    const storedUser = authService.getUser()

    console.log('📦 Datos del localStorage:', {
      hasToken: !!storedToken,
      hasUser: !!storedUser,
      tokenPreview: storedToken ? `${storedToken.substring(0, 10)}...` : 'none',
      userName: storedUser?.name || 'none'
    })

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = storedUser
      console.log('✅ Sesión restaurada:', storedUser.name)
      
      // Iniciar validación periódica
      startTokenValidation()
      
      // Validar inmediatamente
      validateTokenSilent()
    } else {
      console.log('ℹ️ No hay sesión previa')
    }
    
    console.log('🎯 Estado final de inicialización:', {
      isAuthenticated: !!(token.value && user.value),
      hasToken: !!token.value,
      hasUser: !!user.value
    })
  }

  // 📝 Registrar usuario
  const register = async (userData) => {
    console.log('📝 Store: Registrando usuario...')
    isLoading.value = true
    error.value = null

    try {
      const result = await authService.register(userData)
      
      if (result.success) {
        token.value = result.data.token
        user.value = result.data.user
        console.log('✅ Store: Registro exitoso')
        
        // Iniciar validación periódica
        startTokenValidation()
        
        return { success: true, message: result.message }
      } else {
        error.value = result.message
        return { success: false, message: result.message, errors: result.errors }
      }

    } catch (err) {
      const errorMsg = 'Error inesperado en el registro'
      error.value = errorMsg
      console.error('❌ Store: Error en registro:', err)
      return { success: false, message: errorMsg }
    } finally {
      isLoading.value = false
    }
  }

  // 🔑 Iniciar sesión
  const login = async (credentials) => {
    console.log('🔑 Store: Iniciando sesión...')
    isLoading.value = true
    error.value = null

    try {
      const result = await authService.login(credentials)
      
      if (result.success) {
        token.value = result.data.token
        user.value = result.data.user
        console.log('✅ Store: Login exitoso')
        
        // Iniciar validación periódica
        startTokenValidation()
        
        return { success: true, message: result.message }
      } else {
        error.value = result.message
        return { 
          success: false, 
          message: result.message, 
          errors: result.errors,
          status: result.status 
        }
      }

    } catch (err) {
      const errorMsg = 'Error inesperado en el login'
      error.value = errorMsg
      console.error('❌ Store: Error en login:', err)
      return { success: false, message: errorMsg }
    } finally {
      isLoading.value = false
    }
  }

  // 🚪 Cerrar sesión
  const logout = async (revokeAllTokens = false) => {
    console.log('🚪 Store: Cerrando sesión...')
    isLoading.value = true
    error.value = null

    try {
      // Detener validación periódica
      stopTokenValidation()
      
      const result = await authService.logout(revokeAllTokens)
      
      // Limpiar estado local
      token.value = null
      user.value = null
      
      console.log('✅ Store: Logout exitoso')
      console.log('🧹 Estado después del logout:', {
        token: token.value,
        user: user.value,
        isAuthenticated: isAuthenticated.value,
        tokenInStorage: !!authService.getToken(),
        userInStorage: !!authService.getUser()
      })
      
      return { success: true, message: result.message }

    } catch (err) {
      // Limpiar estado local aunque falle la API
      token.value = null
      user.value = null
      stopTokenValidation()
      
      console.error('❌ Store: Error en logout:', err)
      return { success: true, message: 'Sesión cerrada localmente' }
    } finally {
      isLoading.value = false
    }
  }

  // 👤 Actualizar datos del usuario
  const refreshUser = async () => {
    if (!isAuthenticated.value) {
      return { success: false, message: 'No autenticado' }
    }

    console.log('👤 Store: Actualizando datos del usuario...')
    
    try {
      const result = await authService.getCurrentUser()
      
      if (result.success) {
        user.value = result.data.user
        console.log('✅ Store: Usuario actualizado')
        return { success: true, message: result.message }
      } else {
        if (result.shouldLogout) {
          await forceLogout()
        }
        return { success: false, message: result.message }
      }

    } catch (err) {
      console.error('❌ Store: Error actualizando usuario:', err)
      return { success: false, message: 'Error al actualizar usuario' }
    }
  }

  // 🔍 Validar token (silencioso, sin loading)
  const validateTokenSilent = async () => {
    if (!token.value) {
      return { success: false, message: 'No hay token' }
    }

    try {
      const result = await authService.validateToken()
      
      if (!result.token_valid) {
        console.warn('⚠️ Store: Token inválido, cerrando sesión...')
        await forceLogout()
        return { success: false, message: 'Token inválido' }
      }

      console.log('✅ Store: Token válido')
      return { success: true, message: 'Token válido' }

    } catch (err) {
      console.error('❌ Store: Error validando token:', err)
      return { success: false, message: 'Error de validación' }
    }
  }

  // 🚨 Cerrar sesión forzado (token inválido)
  const forceLogout = async () => {
    console.log('🚨 Store: Logout forzado - token inválido')
    
    // Detener validación periódica
    stopTokenValidation()
    
    // Limpiar datos
    authService.clearAuth()
    token.value = null
    user.value = null
    error.value = 'Sesión expirada'

    // Emitir evento para que otros componentes reaccionen
    window.dispatchEvent(new CustomEvent('auth:force-logout', {
      detail: { reason: 'Token inválido' }
    }))
  }

  // ⏰ Iniciar validación periódica del token
  const startTokenValidation = () => {
    // Limpiar intervalo anterior si existe
    stopTokenValidation()
    
    console.log(`⏰ Store: Iniciando validación periódica cada ${TOKEN_VALIDATION_INTERVAL / 1000 / 60} minutos`)
    
    tokenValidationInterval.value = setInterval(async () => {
      console.log('🔄 Validación periódica del token...')
      await validateTokenSilent()
    }, TOKEN_VALIDATION_INTERVAL)
  }

  // ⏹️ Detener validación periódica
  const stopTokenValidation = () => {
    if (tokenValidationInterval.value) {
      clearInterval(tokenValidationInterval.value)
      tokenValidationInterval.value = null
      console.log('⏹️ Store: Validación periódica detenida')
    }
  }

  // 🎫 Obtener tokens activos
  const getActiveTokens = async () => {
    if (!isAuthenticated.value) {
      return { success: false, message: 'No autenticado' }
    }

    try {
      const result = await authService.getTokens()
      return result
    } catch (err) {
      console.error('❌ Store: Error obteniendo tokens:', err)
      return { success: false, message: 'Error al obtener tokens' }
    }
  }

  // 🔒 Verificar permisos específicos
  const hasPermission = (permission) => {
    if (!isAuthenticated.value) return false
    
    // Los admins tienen todos los permisos
    if (isAdmin.value) return true
    
    // Aquí puedes agregar lógica más compleja de permisos
    // basada en roles, habilidades específicas, etc.
    
    return false
  }

  // 🧹 Reset completo del store
  const resetStore = () => {
    console.log('🧹 Store: Reseteando estado completo')
    stopTokenValidation()
    authService.clearAuth()
    
    user.value = null
    token.value = null
    isLoading.value = false
    error.value = null
  }

  // 🎯 Exportar todo el store
  return {
    // Estado
    user,
    token,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    isAdmin,
    userName,
    userRole,

    // Acciones
    initializeAuth,
    register,
    login,
    logout,
    refreshUser,
    validateTokenSilent,
    forceLogout,
    startTokenValidation,
    stopTokenValidation,
    getActiveTokens,
    hasPermission,
    clearError,
    resetStore,

    // Constantes
    TOKEN_VALIDATION_INTERVAL
  }
})

// 🔄 Auto-inicializar cuando se carga el módulo
let autoInitialized = false

export const autoInitializeAuth = () => {
  if (!autoInitialized) {
    const authStore = useAuthStore()
    authStore.initializeAuth()
    autoInitialized = true
    console.log('🚀 Store de autenticación auto-inicializado')
  }
}