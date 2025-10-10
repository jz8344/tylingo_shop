import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])

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

    // Guardar en localStorage
    saveToLocalStorage()
    
    return true
  }

  function removeFromCart(productId) {
    items.value = items.value.filter(item => item.id !== productId)
    saveToLocalStorage()
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveToLocalStorage()
      }
    }
  }

  function clearCart() {
    items.value = []
    localStorage.removeItem('tylingo_cart')
  }

  function saveToLocalStorage() {
    localStorage.setItem('tylingo_cart', JSON.stringify(items.value))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('tylingo_cart')
    if (saved) {
      items.value = JSON.parse(saved)
    }
  }

  // Inicializar desde localStorage
  loadFromLocalStorage()

  return {
    items,
    itemCount,
    subtotal,
    isEmpty,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
})
