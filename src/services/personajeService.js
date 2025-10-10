/**
 * Personaje Service
 * Servicio para gestionar personajes
 */

import { get } from './api'

/**
 * Get all personajes
 * @returns {Promise<Array>}
 */
export async function getAllPersonajes() {
  try {
    return await get('/personajes')
  } catch (error) {
    console.error('Error fetching personajes:', error)
    throw error
  }
}

/**
 * Get single personaje by ID
 * @param {number} id - ID del personaje
 * @returns {Promise<Object>}
 */
export async function getPersonajeById(id) {
  try {
    return await get(`/personajes/${id}`)
  } catch (error) {
    console.error(`Error fetching personaje ${id}:`, error)
    throw error
  }
}

export default {
  getAllPersonajes,
  getPersonajeById
}
