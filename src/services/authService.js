/**
 * 🔐 Servicio de Autenticación con Laravel Sanctum
 * 
 * Centraliza todas las llamadas de autenticación a la API
 * Maneja tokens, errores y almacenamiento local
 */

import { getApiUrl } from './api.js'

class AuthService {
  constructor() {
    this.apiUrl = getApiUrl()
    this.tokenKey = 'tylingo_auth_token'
    this.userKey = 'tylingo_user_data'
  }

  /**
   * 🔄 Actualizar URL de API dinámicamente
   */
  updateApiUrl() {
    this.apiUrl = getApiUrl()
    console.log('🔄 AuthService: URL API actualizada a:', this.apiUrl)
  }

  /**
   * 🪙 Obtener token del localStorage
   */
  getToken() {
    return localStorage.getItem(this.tokenKey)
  }

  /**
   * 💾 Guardar token en localStorage
   */
  setToken(token) {
    if (token) {
      localStorage.setItem(this.tokenKey, token)
      console.log('🪙 Token guardado exitosamente')
    } else {
      localStorage.removeItem(this.tokenKey)
      console.log('🗑️ Token eliminado')
    }
  }

  /**
   * 👤 Obtener datos del usuario del localStorage
   */
  getUser() {
    const userData = localStorage.getItem(this.userKey)
    return userData ? JSON.parse(userData) : null
  }

  /**
   * 💾 Guardar datos del usuario en localStorage
   */
  setUser(userData) {
    if (userData) {
      localStorage.setItem(this.userKey, JSON.stringify(userData))
      console.log('👤 Datos de usuario guardados:', userData.name)
    } else {
      localStorage.removeItem(this.userKey)
      console.log('🗑️ Datos de usuario eliminados')
    }
  }

  /**
   * 🔨 Headers para peticiones autenticadas
   */
  getAuthHeaders() {
    const token = this.getToken()
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  /**
   * 📝 Registrar nuevo usuario
   */
  async register(userData) {
    try {
      console.log('📝 Registrando usuario:', userData.username)
      this.updateApiUrl()

      const response = await fetch(`${this.apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro')
      }

      if (data.success && data.data) {
        // Guardar token y datos del usuario
        this.setToken(data.data.token)
        this.setUser(data.data.user)
        console.log('✅ Registro exitoso:', data.data.user.name)
      }

      return {
        success: true,
        data: data.data,
        message: data.message
      }

    } catch (error) {
      console.error('❌ Error en registro:', error)
      return {
        success: false,
        message: error.message,
        errors: error.errors || {}
      }
    }
  }

  /**
   * 🔑 Iniciar sesión
   */
  async login(credentials) {
    try {
      console.log('🔑 Iniciando sesión:', credentials.username)
      this.updateApiUrl()

      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (!response.ok) {
        throw {
          message: data.message || 'Error en el login',
          errors: data.errors || {},
          status: response.status
        }
      }

      if (data.success && data.data) {
        // Guardar token y datos del usuario
        this.setToken(data.data.token)
        this.setUser(data.data.user)
        console.log('✅ Login exitoso:', data.data.user.name)
      }

      return {
        success: true,
        data: data.data,
        message: data.message
      }

    } catch (error) {
      console.error('❌ Error en login:', error)
      return {
        success: false,
        message: error.message || 'Error de conexión',
        errors: error.errors || {},
        status: error.status || 500
      }
    }
  }

  /**
   * 🚪 Cerrar sesión
   */
  async logout(revokeAllTokens = false) {
    try {
      console.log('🚪 Cerrando sesión...')
      this.updateApiUrl()

      const response = await fetch(`${this.apiUrl}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ revoke_all_tokens: revokeAllTokens })
      })

      const data = await response.json()

      // Limpiar datos locales independientemente del resultado de la API
      this.setToken(null)
      this.setUser(null)

      if (!response.ok) {
        console.warn('⚠️ Error en logout API, pero limpieza local completada')
      } else {
        console.log('✅ Logout exitoso:', data.message)
      }

      return {
        success: true,
        message: data?.message || 'Sesión cerrada localmente'
      }

    } catch (error) {
      console.error('❌ Error en logout:', error)
      // Asegurar limpieza local aunque falle la API
      this.setToken(null)
      this.setUser(null)
      
      return {
        success: true, // Consideramos exitoso porque limpiamos localmente
        message: 'Sesión cerrada (limpieza local)'
      }
    }
  }

  /**
   * 👤 Obtener datos del usuario autenticado
   */
  async getCurrentUser() {
    try {
      console.log('👤 Obteniendo usuario actual...')
      this.updateApiUrl()

      const response = await fetch(`${this.apiUrl}/auth/user`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener usuario')
      }

      if (data.success && data.data) {
        // Actualizar datos del usuario en localStorage
        this.setUser(data.data.user)
        console.log('✅ Usuario obtenido:', data.data.user.name)
      }

      return {
        success: true,
        data: data.data,
        message: data.message
      }

    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error)
      return {
        success: false,
        message: error.message,
        shouldLogout: error.status === 401
      }
    }
  }

  /**
   * 🔍 Validar token actual
   */
  async validateToken() {
    try {
      const token = this.getToken()
      if (!token) {
        return { success: false, message: 'No hay token', token_valid: false }
      }

      this.updateApiUrl()

      const response = await fetch(`${this.apiUrl}/auth/validate-token`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        console.warn('⚠️ Token inválido')
        return {
          success: false,
          message: data.message || 'Token inválido',
          token_valid: false
        }
      }

      console.log('✅ Token válido')
      return {
        success: true,
        message: data.message,
        token_valid: true,
        data: data.data
      }

    } catch (error) {
      console.error('❌ Error validando token:', error)
      return {
        success: false,
        message: 'Error de conexión',
        token_valid: false
      }
    }
  }

  /**
   * 🧹 Limpiar todos los datos de autenticación
   */
  clearAuth() {
    this.setToken(null)
    this.setUser(null)
    console.log('🧹 Datos de autenticación limpiados')
  }

  /**
   * ✅ Verificar si el usuario está autenticado
   */
  isAuthenticated() {
    return !!(this.getToken() && this.getUser())
  }

  /**
   * 👑 Verificar si el usuario es administrador
   */
  isAdmin() {
    const user = this.getUser()
    return user ? (user.is_admin || user.role === 'admin') : false
  }

  /**
   * 🎫 Obtener lista de tokens activos
   */
  async getTokens() {
    try {
      console.log('🎫 Obteniendo tokens activos...')
      this.updateApiUrl()

      const response = await fetch(`${this.apiUrl}/auth/tokens`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener tokens')
      }

      return {
        success: true,
        data: data.data,
        message: data.message
      }

    } catch (error) {
      console.error('❌ Error obteniendo tokens:', error)
      return {
        success: false,
        message: error.message
      }
    }
  }
}

// Instancia singleton
const authService = new AuthService()

// Exportar tanto la clase como la instancia
export { AuthService }
export default authService

// Exportar métodos individuales para mayor conveniencia
export const {
  register,
  login,
  logout,
  getCurrentUser,
  validateToken,
  clearAuth,
  isAuthenticated,
  isAdmin,
  getToken,
  getUser,
  getTokens
} = authService