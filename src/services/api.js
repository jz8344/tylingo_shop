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
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(error.message || 'Error en la petición')
  }
  return response.json()
}

/**
 * GET request
 * @param {string} endpoint 
 * @param {Object} params Query parameters
 * @returns {Promise}
 */
export async function get(endpoint, params = {}) {
  const url = new URL(`${API_URL}${endpoint}`)
  
  // Agregar parámetros de búsqueda
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key])
    }
  })
  
  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
    return handleResponse(response)
  } catch (error) {
    console.error(`Error GET ${endpoint}:`, error)
    throw error
  }
}

/**
 * POST request
 * @param {string} endpoint 
 * @param {Object} data 
 * @returns {Promise}
 */
export async function post(endpoint, data = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  } catch (error) {
    console.error(`Error POST ${endpoint}:`, error)
    throw error
  }
}

/**
 * PUT request
 * @param {string} endpoint 
 * @param {Object} data 
 * @returns {Promise}
 */
export async function put(endpoint, data = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  } catch (error) {
    console.error(`Error PUT ${endpoint}:`, error)
    throw error
  }
}

/**
 * DELETE request
 * @param {string} endpoint 
 * @returns {Promise}
 */
export async function del(endpoint) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
    return handleResponse(response)
  } catch (error) {
    console.error(`Error DELETE ${endpoint}:`, error)
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
