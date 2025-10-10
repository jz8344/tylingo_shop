/**
 * Skin Service
 * Servicio para gestionar skins
 */

import { get } from './api'

/**
 * Get all skins
 * @returns {Promise<Array>}
 */
export async function getAllSkins() {
  try {
    return await get('/skins')
  } catch (error) {
    console.error('Error fetching skins:', error)
    throw error
  }
}

/**
 * Get single skin by ID
 * @param {number} id - ID del skin
 * @returns {Promise<Object>}
 */
export async function getSkinById(id) {
  try {
    return await get(`/skins/${id}`)
  } catch (error) {
    console.error(`Error fetching skin ${id}:`, error)
    throw error
  }
}

export default {
  getAllSkins,
  getSkinById
}
