/**
 * Moneda Service
 * Servicio para gestionar monedas
 */

import { get } from './api'

/**
 * Get all monedas
 * @returns {Promise<Array>}
 */
export async function getAllMonedas() {
  try {
    return await get('/monedas')
  } catch (error) {
    console.error('Error fetching monedas:', error)
    throw error
  }
}

/**
 * Get single moneda by ID
 * @param {number} id - ID de la moneda
 * @returns {Promise<Object>}
 */
export async function getMonedaById(id) {
  try {
    return await get(`/monedas/${id}`)
  } catch (error) {
    console.error(`Error fetching moneda ${id}:`, error)
    throw error
  }
}

export default {
  getAllMonedas,
  getMonedaById
}
