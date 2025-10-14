import api from './api'

/**
 * Servicio para integración con MercadoPago
 */
export const mercadoPagoService = {
  /**
   * Obtener la configuración pública de MercadoPago (Public Key)
   */
  async getPublicConfig() {
    try {
      const response = await api.get('/mercadopago/config')
    return response
    } catch (error) {
      console.error('Error al obtener configuración de MercadoPago:', error)
      throw error
    }
  },

  /**
   * Crear una preferencia de pago en MercadoPago
   * @param {Array} items - Lista de productos a pagar
   * @param {Object} payerInfo - Información del comprador
   * @param {String} externalReference - Referencia externa del pedido
   * @returns {Object} - Objeto con preference_id, init_point y sandbox_init_point
   */
  async createPaymentPreference(items, payerInfo, externalReference) {
    try {
      const payload = {
        items: items.map(item => ({
          id: item.id.toString(),
          title: item.title || item.nombre,
          description: item.description || item.descripcion || item.title || item.nombre,
          quantity: parseInt(item.quantity || item.cantidad || 1),
          unit_price: parseFloat(item.unit_price || item.precio || item.precio_oferta || 0),
          picture_url: item.picture_url || item.imagen_url || null
        })),
        payer: {
          email: payerInfo.email,
          name: payerInfo.name || payerInfo.nombre
        },
        external_reference: externalReference || `PEDIDO-${Date.now()}`
      }

      console.log('Enviando datos a MercadoPago:', payload)

      // Usar la ruta protegida que requiere autenticación
      const response = await api.post('/mercadopago/create-preference', payload, true)
      return response
    } catch (error) {
      console.error('Error al crear preferencia de pago:', error)
      
      // Manejar errores específicos
      if (error.status === 401) {
        throw new Error('Debes iniciar sesión para proceder con el pago')
      } else if (error.code === 'USER_NOT_AUTHENTICATED') {
        throw new Error('Debes iniciar sesión para proceder con el pago')
      } else {
        throw new Error(error.message || 'Error al procesar el pago. Por favor intenta de nuevo.')
      }
    }
  },

  /**
   * Redirigir al usuario a la página de pago de MercadoPago
   * @param {String} initPoint - URL de checkout (sandbox_init_point en TEST)
   */
  redirectToCheckout(initPoint) {
    window.location.href = initPoint
  },

  /**
   * Función auxiliar para iniciar el flujo de pago completo
   * @param {Array} cartItems - Items del carrito
   * @param {Object} userInfo - Información del usuario
   */
  async initiatePayment(cartItems, userInfo) {
    try {
      // 1. Crear preferencia de pago
      const preference = await this.createPaymentPreference(
        cartItems,
        {
          email: userInfo.email || 'test_user@testuser.com',
          name: userInfo.name || 'Usuario de Prueba'
        },
        `PEDIDO-${Date.now()}`
      )

      // 2. Redirigir a MercadoPago (usar sandbox_init_point en modo TEST)
      this.redirectToCheckout(preference.sandbox_init_point || preference.init_point)

      return preference
    } catch (error) {
      console.error('Error al iniciar pago:', error)
      throw error
    }
  }
}

export default mercadoPagoService
