/**
 * API Service - Base configuration
 * Servicio base para realizar peticiones HTTP a la API de Laravel
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

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

export default {
  get,
  post,
  put,
  delete: del,
  API_URL
}
