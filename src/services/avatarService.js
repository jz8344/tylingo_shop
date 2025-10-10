/**
 * Avatar Service
 * Servicio para gestionar avatares
 */

import { get } from './api'

/**
 * Get all avatares
 * @returns {Promise<Array>}
 */
export async function getAllAvatares() {
  try {
    return await get('/avatares')
  } catch (error) {
    console.error('Error fetching avatares:', error)
    throw error
  }
}

/**
 * Get single avatar by ID
 * @param {number} id - ID del avatar
 * @returns {Promise<Object>}
 */
export async function getAvatarById(id) {
  try {
    return await get(`/avatares/${id}`)
  } catch (error) {
    console.error(`Error fetching avatar ${id}:`, error)
    throw error
  }
}

export default {
  getAllAvatares,
  getAvatarById
}
