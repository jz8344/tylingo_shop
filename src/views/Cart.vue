<template>
  <section class="min-h-screen py-16 relative overflow-hidden">
    <!-- Starfield Background -->
    <div id="stars"></div>

    <div class="container mx-auto px-4 relative z-10 max-w-6xl">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold unsc-title">🛒 Carrito de Compras</h1>
        <p class="text-blue-300 mt-2">{{ itemCount }} productos en tu carrito</p>
      </div>

      <!-- Carrito vacío -->
      <div v-if="isEmpty" class="glass-card p-12 text-center">
        <div class="text-6xl mb-4">🛒</div>
        <h2 class="text-2xl font-bold text-white mb-2">Tu carrito está vacío</h2>
        <p class="text-blue-300 mb-6">Agrega productos para comenzar tu compra</p>
        <router-link to="/" class="btn-unsc px-6 py-3 inline-block">
          <i data-feather="home" class="inline mr-2 w-4"></i>
          Ir a la tienda
        </router-link>
      </div>

      <!-- Carrito con productos -->
      <div v-else class="grid lg:grid-cols-3 gap-6">
        <!-- Lista de productos -->
        <div class="lg:col-span-2 space-y-4">
          <div v-for="item in items" :key="item.id" class="glass-card p-4">
            <div class="flex gap-4">
              <!-- Imagen -->
              <div class="w-24 h-24 flex-shrink-0">
                <img 
                  :src="item.imagen_url || item.imagen_path || '/img/default.png'" 
                  :alt="item.nombre"
                  class="w-full h-full object-cover rounded-lg"
                  @error="handleImageError"
                />
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-white text-lg truncate">{{ item.nombre }}</h3>
                <p class="text-blue-300 text-sm mb-2">{{ item.videojuego }}</p>
                
                <!-- Precio -->
                <div class="flex items-center gap-2">
                  <span v-if="item.precio_oferta" class="text-green-400 font-bold text-xl">
                    ${{ item.precio_oferta }}
                  </span>
                  <span 
                    :class="item.precio_oferta ? 'text-gray-400 line-through text-sm' : 'text-green-400 font-bold text-xl'"
                  >
                    ${{ item.precio }}
                  </span>
                </div>
              </div>

              <!-- Cantidad y eliminar -->
              <div class="flex flex-col items-end justify-between">
                <!-- Controles de cantidad -->
                <div class="flex items-center gap-2">
                  <button 
                    @click="decrementQuantity(item.id)"
                    class="bg-blue-600 hover:bg-blue-700 text-white w-8 h-8 rounded flex items-center justify-center transition"
                  >
                    -
                  </button>
                  <span class="text-white font-bold w-8 text-center">{{ item.quantity }}</span>
                  <button 
                    @click="incrementQuantity(item.id)"
                    class="bg-blue-600 hover:bg-blue-700 text-white w-8 h-8 rounded flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>

                <!-- Subtotal y eliminar -->
                <div class="text-right">
                  <p class="text-cyan-400 font-bold mb-2">
                    ${{ ((item.precio_oferta || item.precio) * item.quantity).toFixed(2) }}
                  </p>
                  <button 
                    @click="removeItem(item.id)"
                    class="text-red-400 hover:text-red-300 text-sm transition"
                  >
                    <i data-feather="trash-2" class="inline w-4 h-4"></i> Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón vaciar carrito -->
          <button 
            @click="confirmClearCart"
            class="text-red-400 hover:text-red-300 text-sm transition"
          >
            <i data-feather="trash" class="inline w-4 h-4 mr-1"></i>
            Vaciar carrito
          </button>
        </div>

        <!-- Resumen y checkout -->
        <div class="lg:col-span-1">
          <div class="glass-card p-6 sticky top-4">
            <h2 class="text-2xl font-bold mb-6 text-cyan-400">Resumen</h2>
            
            <div class="space-y-3 mb-6 pb-6 border-b border-blue-600">
              <div class="flex justify-between text-blue-300">
                <span>Productos ({{ itemCount }})</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-blue-300">
                <span>Envío</span>
                <span class="text-green-400">GRATIS</span>
              </div>
            </div>

            <div class="flex justify-between text-xl font-bold mb-6">
              <span class="text-white">Total</span>
              <span class="text-green-400">${{ subtotal.toFixed(2) }} MXN</span>
            </div>

            <!-- Formulario de comprador -->
            <div class="space-y-3 mb-6">
              <input 
                v-model="buyerEmail" 
                type="email" 
                placeholder="Tu email"
                class="w-full px-4 py-2 rounded bg-blue-900/30 border border-blue-600 text-white placeholder-blue-400"
                required
              />
              <input 
                v-model="buyerName" 
                type="text" 
                placeholder="Tu nombre"
                class="w-full px-4 py-2 rounded bg-blue-900/30 border border-blue-600 text-white placeholder-blue-400"
                required
              />
            </div>

            <!-- Botón de pago -->
            <button 
              @click="handleCheckout"
              :disabled="processing || !buyerEmail || !buyerName"
              class="w-full btn-unsc px-6 py-3 flex items-center justify-center gap-2"
            >
              <span v-if="processing">
                <i data-feather="loader" class="inline w-5 h-5 animate-spin"></i>
                Procesando...
              </span>
              <span v-else>
                💳 Pagar con MercadoPago
              </span>
            </button>

            <!-- Mensaje de error -->
            <div v-if="error" class="mt-4 bg-red-500/20 border border-red-500 rounded p-3">
              <p class="text-red-300 text-sm">{{ error }}</p>
            </div>

            <!-- Indicador de modo TEST -->
            <div class="mt-4 bg-yellow-500/20 border border-yellow-500 rounded p-3">
              <p class="text-yellow-300 text-xs">
                ⚠️ <strong>Modo TEST:</strong> No se realizarán cargos reales
              </p>
            </div>

            <!-- Tarjeta de prueba -->
            <div class="mt-4 text-xs text-blue-300 space-y-1">
              <p class="font-semibold">Tarjeta de prueba:</p>
              <p>5031 4332 1540 6351</p>
              <p>CVV: 123 | Venc: 11/25</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import mercadoPagoService from '@/services/mercadoPagoService'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const processing = ref(false)
const error = ref(null)
const buyerEmail = ref('test_user@testuser.com')
const buyerName = ref('Usuario Prueba')

// Computed
const items = computed(() => cartStore.items)
const itemCount = computed(() => cartStore.itemCount)
const subtotal = computed(() => cartStore.subtotal)
const isEmpty = computed(() => cartStore.isEmpty)

// Methods
function incrementQuantity(productId) {
  const item = items.value.find(i => i.id === productId)
  if (item) {
    cartStore.updateQuantity(productId, item.quantity + 1)
  }
}

function decrementQuantity(productId) {
  const item = items.value.find(i => i.id === productId)
  if (item) {
    if (item.quantity > 1) {
      cartStore.updateQuantity(productId, item.quantity - 1)
    } else {
      removeItem(productId)
    }
  }
}

function removeItem(productId) {
  if (confirm('¿Eliminar este producto del carrito?')) {
    cartStore.removeFromCart(productId)
  }
}

function confirmClearCart() {
  if (confirm('¿Vaciar todo el carrito?')) {
    cartStore.clearCart()
  }
}

function handleImageError(event) {
  event.target.src = '/img/default.png'
}

// Show authentication required dialog
async function showAuthRequiredDialog() {
  return new Promise((resolve) => {
    const result = confirm(
      '🔒 Para proceder con el pago necesitas estar logueado.\n\n¿Deseas ir a la página de login ahora?'
    )
    resolve(result)
  })
}

async function handleCheckout() {
  try {
    processing.value = true
    error.value = null

    // 🔒 VERIFICAR AUTENTICACIÓN ANTES DE PROCEDER
    console.log('🔒 Verificando autenticación para checkout...')
    console.log('Estado auth:', {
      isAuthenticated: authStore.isAuthenticated,
      hasToken: !!authStore.token,
      hasUser: !!authStore.user,
      cartAuth: cartStore.isUserAuthenticated
    })

    if (!authStore.isAuthenticated || !authStore.token || !authStore.user) {
      console.log('❌ Usuario no autenticado, solicitando login')
      
      const shouldLogin = await showAuthRequiredDialog()
      if (shouldLogin) {
        router.push({ name: 'Login', query: { redirect: '/cart' } })
      }
      return
    }

    console.log('✅ Usuario autenticado, procediendo con checkout')

    if (!buyerEmail.value || !buyerName.value) {
      error.value = 'Por favor completa tu email y nombre'
      return
    }

    // Preparar items para MercadoPago
    const mpItems = items.value.map(item => ({
      id: item.id.toString(),
      title: item.nombre,
      description: item.descripcion || item.nombre,
      quantity: item.quantity,
      unit_price: parseFloat(item.precio_oferta || item.precio),
      picture_url: item.imagen_url || null
    }))

    console.log('Creando preferencia con items:', mpItems)

    // Crear preferencia de pago
    const result = await mercadoPagoService.createPaymentPreference(
      mpItems,
      {
        email: buyerEmail.value,
        name: buyerName.value
      },
      `PEDIDO-${Date.now()}`
    )

    console.log('Preferencia creada:', result)

    // Guardar referencia del pedido
    localStorage.setItem('last_order_reference', `PEDIDO-${Date.now()}`)
    localStorage.setItem('last_order_items', JSON.stringify(items.value))

    // Verificar que la preferencia incluye init_point o sandbox_init_point
    const initPoint = result?.sandbox_init_point || result?.init_point
    if (!initPoint) {
      throw new Error('La preferencia no devolvió una URL de pago (init_point).')
    }

    // Redirigir a MercadoPago
    window.location.href = initPoint

  } catch (err) {
    console.error('Error al procesar checkout:', err)
    
    // Manejar diferentes tipos de errores
    if (err.message.includes('iniciar sesión') || err.message.includes('login')) {
      error.value = '🔒 Debes iniciar sesión para proceder con el pago'
      
      // Opcional: redirigir automáticamente al login después de un momento
      setTimeout(() => {
        if (confirm('¿Deseas ir a la página de login ahora?')) {
          window.location.href = '/login'
        }
      }, 2000)
    } else {
      error.value = err.message || 'Error al procesar el pago. Por favor intenta de nuevo.'
    }
  } finally {
    processing.value = false
  }
}

onMounted(() => {
  createStarField()
  
  // Inicializar iconos de Feather
  if (window.feather) {
    window.feather.replace()
  }
})

function createStarField() {
  function createStar(layer, opts = {}) {
    const s = document.createElement('div')
    s.className = 'star'
    if (opts.variant) s.classList.add(opts.variant)
    s.style.setProperty('--size', (opts.size || (Math.random() * 2 + 1)) + 'px')
    s.style.setProperty('--opacity', (opts.opacity || (Math.random() * 0.6 + 0.4)))
    s.style.setProperty('--twinkle', (opts.twinkle || (Math.random() * 4 + 2)) + 's')
    s.style.left = (Math.random() * 100) + '%'
    s.style.top = (Math.random() * 100) + '%'
    return s
  }

  function populate(layer, count, variantChance) {
    const frag = document.createDocumentFragment()
    for (let i = 0; i < count; i++) {
      const variant = Math.random() < variantChance ? (Math.random() < 0.7 ? 'cold' : 'warm') : null
      frag.appendChild(createStar(layer, { variant }))
    }
    layer.appendChild(frag)
  }

  const layers = [document.getElementById('stars')]
  if (layers[0]) {
    const counts = [100]
    populate(layers[0], counts[0], 0.2)
  }
}
</script>
