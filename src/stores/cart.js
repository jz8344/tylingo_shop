import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from './auth.js'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])
  const currentUserId = ref(null)
  const isInitialized = ref(false)

  // Get auth store
  const authStore = useAuthStore()

  // Getters
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => {
      const price = item.precio_oferta || item.precio || 0
      return total + (price * item.quantity)
    }, 0)
  })

  const isEmpty = computed(() => items.value.length === 0)

  // Check if user is authenticated (computed para reactividad)
  const isUserAuthenticated = computed(() => {
    return !!(authStore.token && authStore.user && authStore.isAuthenticated)
  })

  // Watch for auth changes
  watch(
    () => authStore.user,
    (newUser, oldUser) => {
      const newUserId = newUser?.id || null
      const oldUserId = oldUser?.id || null
      
      console.log('👤 Cambio de usuario detectado:', { 
        oldUser: oldUserId ? `ID ${oldUserId}` : 'anónimo', 
        newUser: newUserId ? `ID ${newUserId}` : 'anónimo',
        token: !!authStore.token,
        isAuthenticated: authStore.isAuthenticated
      })
      
      if (newUserId !== oldUserId) {
        handleUserChange(newUserId, oldUserId)
      }
    },
    { immediate: true }
  )

  // Also listen to force logout events
  if (typeof window !== 'undefined') {
    window.addEventListener('auth:force-logout', () => {
      console.log('🚨 Logout forzado detectado, limpiando carrito de usuario')
      handleUserChange(null, currentUserId.value)
    })
  }

  // Handle user change
  function handleUserChange(newUserId, oldUserId) {
    console.log('🔄 Cambio de usuario:', { from: oldUserId, to: newUserId })
    
    // Si había un usuario anterior, guardar su carrito
    if (oldUserId && items.value.length > 0) {
      saveCartForUser(oldUserId)
      console.log('💾 Carrito guardado para usuario anterior:', oldUserId)
    }

    // Cargar carrito del nuevo usuario (o carrito anónimo si no está logueado)
    loadCartForUser(newUserId)
    
    // Si el usuario se está logeando, limpiar carrito anónimo
    if (newUserId && !oldUserId) {
      cleanupAnonymousCart()
      console.log('👤 Carrito cargado para usuario:', newUserId)
    } else if (!newUserId && oldUserId) {
      console.log('👻 Cambiado a carrito anónimo')
    }
    
    currentUserId.value = newUserId
  }

  // Generate cart key based on user
  function getCartKey(userId = null) {
    return userId ? `tylingo_cart_user_${userId}` : 'tylingo_cart_anonymous'
  }

  // Save cart for specific user
  function saveCartForUser(userId = null) {
    const key = getCartKey(userId)
    localStorage.setItem(key, JSON.stringify(items.value))
    console.log(`💾 Carrito guardado para ${userId ? `usuario ${userId}` : 'usuario anónimo'}`)
  }

  // Load cart for specific user
  function loadCartForUser(userId = null) {
    const key = getCartKey(userId)
    const saved = localStorage.getItem(key)
    
    if (saved) {
      items.value = JSON.parse(saved)
      console.log(`📦 Carrito cargado para ${userId ? `usuario ${userId}` : 'usuario anónimo'}:`, items.value.length, 'items')
    } else {
      items.value = []
      console.log(`🛒 Carrito vacío para ${userId ? `usuario ${userId}` : 'usuario anónimo'}`)
    }
  }

  // Clear cart for specific user
  function clearCartForUser(userId = null) {
    const key = getCartKey(userId)
    localStorage.removeItem(key)
    console.log(`🗑️ Carrito eliminado para ${userId ? `usuario ${userId}` : 'usuario anónimo'}`)
  }

  // Actions
  function addToCart(product) {
    const existingItem = items.value.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({
        ...product,
        quantity: 1
      })
    }

    // Guardar en localStorage para el usuario actual
    saveCartForUser(currentUserId.value)
    
    return true
  }

  function removeFromCart(productId) {
    items.value = items.value.filter(item => item.id !== productId)
    saveCartForUser(currentUserId.value)
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveCartForUser(currentUserId.value)
      }
    }
  }

  function clearCart() {
    items.value = []
    clearCartForUser(currentUserId.value)
  }

  // Migration function for old cart data
  function migrateOldCartData() {
    const oldCart = localStorage.getItem('tylingo_cart')
    if (oldCart && !currentUserId.value) {
      // Si hay un carrito viejo y no hay usuario logueado, moverlo a anónimo
      localStorage.setItem('tylingo_cart_anonymous', oldCart)
      localStorage.removeItem('tylingo_cart')
      console.log('🔄 Carrito migrado a formato anónimo')
    }
  }

  // Clean up old anonymous carts when user logs in
  function cleanupAnonymousCart() {
    if (currentUserId.value) {
      const anonymousCart = localStorage.getItem('tylingo_cart_anonymous')
      if (anonymousCart) {
        try {
          const anonymousItems = JSON.parse(anonymousCart)
          const userCart = localStorage.getItem(getCartKey(currentUserId.value))
          
          if (!userCart || userCart === '[]') {
            // Si el usuario no tiene carrito o está vacío, transferir el anónimo
            localStorage.setItem(getCartKey(currentUserId.value), anonymousCart)
            items.value = anonymousItems
            console.log('🔄 Carrito anónimo transferido al usuario:', anonymousItems.length, 'items')
          } else {
            // Si el usuario ya tiene carrito, merge intelligent (opcional)
            console.log('👤 Usuario ya tiene carrito, manteniendo su carrito existente')
          }
          
          // Limpiar carrito anónimo
          localStorage.removeItem('tylingo_cart_anonymous')
        } catch (error) {
          console.error('❌ Error procesando carrito anónimo:', error)
          localStorage.removeItem('tylingo_cart_anonymous')
        }
      }
    }
  }

  // Merge anonymous cart with user cart (advanced feature)
  function mergeAnonymousCart() {
    if (currentUserId.value) {
      const anonymousCart = localStorage.getItem('tylingo_cart_anonymous')
      if (anonymousCart) {
        try {
          const anonymousItems = JSON.parse(anonymousCart)
          
          // Merge items avoiding duplicates
          anonymousItems.forEach(anonymousItem => {
            const existingItem = items.value.find(item => item.id === anonymousItem.id)
            if (existingItem) {
              // Sumar cantidades si el producto ya existe
              existingItem.quantity += anonymousItem.quantity
            } else {
              // Agregar nuevo producto
              items.value.push(anonymousItem)
            }
          })
          
          // Guardar carrito merged
          saveCartForUser(currentUserId.value)
          
          // Limpiar carrito anónimo
          localStorage.removeItem('tylingo_cart_anonymous')
          
          console.log('🔗 Carrito anónimo merged con carrito de usuario')
        } catch (error) {
          console.error('❌ Error merging carrito anónimo:', error)
        }
      }
    }
  }

  // Initialize cart
  function initializeCart() {
    console.log('🛒 Inicializando carrito...')
    
    // Migrar datos viejos si existen
    migrateOldCartData()
    
    // Verificar estado de autenticación actual
    const userId = authStore.user?.id || null
    const hasToken = !!authStore.token
    const isAuth = authStore.isAuthenticated
    
    console.log('👤 Estado inicial de autenticación:', {
      userId,
      hasToken,
      isAuth,
      tokenFromStorage: !!localStorage.getItem('tylingo_auth_token'),
      userFromStorage: !!localStorage.getItem('tylingo_user_data')
    })
    
    // Cargar carrito para el usuario actual
    loadCartForUser(userId)
    currentUserId.value = userId
    
    // Limpiar carrito anónimo si hay usuario logueado
    if (userId && hasToken) {
      cleanupAnonymousCart()
    }
    
    isInitialized.value = true
    console.log('✅ Carrito inicializado correctamente')
  }

  // Auto-initialize
  initializeCart()

  return {
    items,
    itemCount,
    subtotal,
    isEmpty,
    isUserAuthenticated,
    isInitialized,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    currentUserId: computed(() => currentUserId.value)
  }
})
