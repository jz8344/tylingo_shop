/**
 * API Service - Base configuration
 * Servicio base para realizar peticiones HTTP a la API de Laravel
 */

/**
 * Get current host IP or hostname
 * Detecta automáticamente la IP/host actual de la aplicación
 */
function getCurrentHost() {
  // Si estamos en el navegador
  if (typeof window !== 'undefined') {
    const currentHost = window.location.hostname
    
    // Si es localhost o 127.0.0.1, usar eso
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'localhost'
    }
    
    // Si es una IP de red local (192.168.x.x, 10.x.x.x, etc), usar esa IP
    return currentHost
  }
  
  return 'localhost'
}

/**
 * Build API URL dynamically based on current environment
 */
function getApiUrl() {
  // Si hay una variable de entorno explícita, usarla
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Detectar el host actual
  const currentHost = getCurrentHost()
  
  // Construir la URL de la API usando el mismo host que el frontend
  const apiPort = import.meta.env.VITE_API_PORT || '8000'
  const apiUrl = `http://${currentHost}:${apiPort}/api/v1`
  
  console.log(`🌐 API URL detectada automáticamente: ${apiUrl}`)
  
  return apiUrl
}

const API_URL = getApiUrl()

/**
 * Handle HTTP response
 * @param {Response} response 
 * @returns {Promise}
 */
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      message: response.statusText,
      status: response.status 
    }))
    
    // Crear un error con información completa
    const apiError = new Error(error.message || 'Error en la petición')
    apiError.status = response.status
    apiError.code = error.code
    apiError.response = error
    
    throw apiError
  }
  return response.json()
}

/**
 * Handle authentication errors
 * @param {Error} error 
 */
function handleAuthError(error) {
  if (error.status === 401) {
    console.log('🚨 Error 401: Token inválido, limpiando autenticación')
    
    // Limpiar tokens inválidos usando las mismas claves que authService
    localStorage.removeItem('tylingo_auth_token')
    localStorage.removeItem('tylingo_user_data')
    
    // Emitir evento para force logout
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:force-logout', {
        detail: { reason: 'Token inválido en API call' }
      }))
      
      // Guardar la página actual para redirigir después del login
      const currentPath = window.location.pathname
      if (currentPath !== '/login') {
        localStorage.setItem('redirect_after_login', currentPath)
      }
    }
  }
}

/**
 * Get authentication headers
 * @returns {Object}
 */
function getAuthHeaders() {
  // Usar la misma clave que en authService.js
  const token = localStorage.getItem('tylingo_auth_token')
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
    console.log('🔑 Token agregado a headers:', `${token.substring(0, 10)}...`)
  } else {
    console.log('⚠️ No hay token disponible para autenticación')
  }
  
  return headers
}

/**
 * GET request
 * @param {string} endpoint 
 * @param {Object} params Query parameters
 * @param {boolean} requireAuth Whether this endpoint requires authentication
 * @returns {Promise}
 */
export async function get(endpoint, params = {}, requireAuth = false) {
  const url = new URL(`${API_URL}${endpoint}`)
  
  // Agregar parámetros de búsqueda
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key])
    }
  })
  
  try {
    const headers = requireAuth ? getAuthHeaders() : {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    })
    return handleResponse(response)
  } catch (error) {
    console.error(`Error GET ${endpoint}:`, error)
    handleAuthError(error)
    throw error
  }
}

/**
 * POST request
 * @param {string} endpoint 
 * @param {Object} data 
 * @param {boolean} requireAuth Whether this endpoint requires authentication
 * @returns {Promise}
 */
export async function post(endpoint, data = {}, requireAuth = false) {
  try {
    const headers = requireAuth ? getAuthHeaders() : {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  } catch (error) {
    console.error(`Error POST ${endpoint}:`, error)
    handleAuthError(error)
    throw error
  }
}

/**
 * PUT request
 * @param {string} endpoint 
 * @param {Object} data 
 * @param {boolean} requireAuth Whether this endpoint requires authentication
 * @returns {Promise}
 */
export async function put(endpoint, data = {}, requireAuth = true) {
  try {
    const headers = requireAuth ? getAuthHeaders() : {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  } catch (error) {
    console.error(`Error PUT ${endpoint}:`, error)
    handleAuthError(error)
    throw error
  }
}

/**
 * DELETE request
 * @param {string} endpoint 
 * @param {boolean} requireAuth Whether this endpoint requires authentication
 * @returns {Promise}
 */
export async function del(endpoint, requireAuth = true) {
  try {
    const headers = requireAuth ? getAuthHeaders() : {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    })
    return handleResponse(response)
  } catch (error) {
    console.error(`Error DELETE ${endpoint}:`, error)
    handleAuthError(error)
    throw error
  }
}

// Export named functions for external use
export { getApiUrl, getCurrentHost }

// Export default object with all API methods
export default {
  get,
  post,
  put,
  delete: del,
  API_URL,
  getApiUrl,
  getCurrentHost
}
