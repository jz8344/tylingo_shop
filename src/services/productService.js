/**
 * Product Service
 * Servicio para gestionar productos (todos los tipos)
 */

import { get } from './api'

/**
 * Get all products
 * @param {Object} filters - Filtros opcionales { videojuego, categoria, ofertas, search }
 * @returns {Promise<Array>}
 */
export async function getAllProducts(filters = {}) {
  try {
    return await get('/productos', filters)
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

/**
 * Get products by game
 * @param {string} game - Nombre del juego (fortnite, callofduty, etc.)
 * @returns {Promise<Array>}
 */
export async function getProductsByGame(game) {
  try {
    return await get(`/productos/juego/${game}`)
  } catch (error) {
    console.error(`Error fetching products for ${game}:`, error)
    throw error
  }
}

/**
 * Get featured/destacados products
 * @returns {Promise<Array>}
 */
export async function getFeaturedProducts() {
  try {
    return await get('/productos/destacados')
  } catch (error) {
    console.error('Error fetching featured products:', error)
    throw error
  }
}

/**
 * Get daily deals
 * @returns {Promise<Array>}
 */
export async function getDailyDeals() {
  try {
    return await get('/productos/ofertas-diarias')
  } catch (error) {
    console.error('Error fetching daily deals:', error)
    throw error
  }
}

/**
 * Search products
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>}
 */
export async function searchProducts(query) {
  try {
    return await get('/productos/buscar', { q: query })
  } catch (error) {
    console.error('Error searching products:', error)
    throw error
  }
}

export default {
  getAllProducts,
  getProductsByGame,
  getFeaturedProducts,
  getDailyDeals,
  searchProducts
}
