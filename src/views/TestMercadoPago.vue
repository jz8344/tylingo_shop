<template>
  <section class="min-h-screen py-16 relative overflow-hidden">
    <!-- Starfield Background -->
    <div id="stars"></div>

    <div class="container mx-auto px-4 relative z-10">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold unsc-title">🧪 Prueba MercadoPago</h1>
        <p class="text-blue-300 mt-2">Modo TEST - Integración con MercadoPago</p>
      </div>

      <!-- Estado de conexión -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p class="text-blue-300 mt-4">Cargando configuración...</p>
      </div>

      <div v-else class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <!-- Configuración -->
        <div class="glass-card p-6">
          <h2 class="text-2xl font-bold mb-4 text-cyan-400">⚙️ Configuración</h2>
          <div class="space-y-3 text-sm">
            <div>
              <span class="text-blue-400 font-semibold">Public Key:</span>
              <p class="text-white font-mono text-xs break-all">{{ config.public_key || 'Cargando...' }}</p>
            </div>
            <div>
              <span class="text-blue-400 font-semibold">Moneda:</span>
              <p class="text-white font-mono">{{ config.currency || 'MXN' }}</p>
            </div>
            <div v-if="error" class="bg-red-500/20 border border-red-500 rounded p-3">
              <p class="text-red-300 text-sm">❌ {{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Producto de Prueba -->
        <div class="glass-card p-6">
          <h2 class="text-2xl font-bold mb-4 text-cyan-400">🛒 Producto de Prueba</h2>
          <div class="space-y-4">
            <div class="bg-blue-900/30 rounded-lg p-4 flex items-center gap-4">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🎮</span>
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-white">Skin Legendaria TEST</h3>
                <p class="text-blue-300 text-sm">Producto de prueba</p>
                <p class="text-green-400 font-bold mt-1">$250.00 {{ config.currency }}</p>
              </div>
            </div>

            <div class="space-y-2">
              <input 
                v-model="buyerEmail" 
                type="email" 
                placeholder="Email del comprador"
                class="w-full px-4 py-2 rounded bg-blue-900/30 border border-blue-600 text-white placeholder-blue-400"
              />
              <input 
                v-model="buyerName" 
                type="text" 
                placeholder="Nombre del comprador"
                class="w-full px-4 py-2 rounded bg-blue-900/30 border border-blue-600 text-white placeholder-blue-400"
              />
            </div>

            <button 
              @click="testPayment"
              :disabled="processing"
              class="w-full btn-unsc px-6 py-3 flex items-center justify-center gap-2"
            >
              <span v-if="processing">Procesando...</span>
              <span v-else>💳 Pagar con MercadoPago</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Instrucciones -->
      <div class="glass-card p-6 max-w-5xl mx-auto mt-8">
        <h2 class="text-2xl font-bold mb-4 text-cyan-400">📝 Instrucciones</h2>
        <div class="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 class="font-semibold text-white mb-2">Tarjeta de Prueba Aprobada:</h3>
            <ul class="space-y-1 text-blue-300">
              <li><strong>Número:</strong> 5031 4332 1540 6351</li>
              <li><strong>CVV:</strong> 123</li>
              <li><strong>Vencimiento:</strong> 11/25</li>
              <li><strong>Titular:</strong> APRO</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-2">Usuario de Prueba:</h3>
            <ul class="space-y-1 text-blue-300">
              <li><strong>Email:</strong> test_user_123456@testuser.com</li>
              <li><strong>Password:</strong> qatest1234</li>
            </ul>
          </div>
        </div>
        <div class="mt-4 bg-yellow-500/20 border border-yellow-500 rounded p-3">
          <p class="text-yellow-300 text-sm">
            ⚠️ <strong>Modo TEST:</strong> Usarás tarjetas de prueba. No se realizarán cargos reales.
          </p>
        </div>
      </div>

      <!-- Resultado -->
      <div v-if="paymentResult" class="glass-card p-6 max-w-5xl mx-auto mt-8">
        <h2 class="text-2xl font-bold mb-4 text-green-400">✅ Preferencia Creada</h2>
        <div class="space-y-2 text-sm font-mono">
          <div>
            <span class="text-blue-400">Preference ID:</span>
            <p class="text-white break-all">{{ paymentResult.preference_id }}</p>
          </div>
          <div>
            <span class="text-blue-400">Init Point:</span>
            <a :href="paymentResult.sandbox_init_point" target="_blank" class="text-cyan-400 hover:underline break-all">
              {{ paymentResult.sandbox_init_point }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import mercadoPagoService from '@/services/mercadoPagoService'

const config = ref({})
const loading = ref(false)
const processing = ref(false)
const error = ref(null)
const paymentResult = ref(null)
const buyerEmail = ref('test_user_123456@testuser.com')
const buyerName = ref('Usuario Prueba')

async function loadConfig() {
  try {
    loading.value = true
    error.value = null
    const data = await mercadoPagoService.getPublicConfig()
    config.value = data
    console.log('Configuración de MercadoPago cargada:', data)
  } catch (err) {
    error.value = 'No se pudo conectar con el servidor. Verifica que Laravel esté corriendo.'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

async function testPayment() {
  try {
    processing.value = true
    error.value = null
    paymentResult.value = null

    const testItem = {
      id: '1',
      title: 'Skin Legendaria TEST',
      description: 'Producto de prueba para MercadoPago',
      quantity: 1,
      unit_price: 250.00,
      picture_url: 'https://via.placeholder.com/150'
    }

    const result = await mercadoPagoService.createPaymentPreference(
      [testItem],
      {
        email: buyerEmail.value,
        name: buyerName.value
      },
      `TEST-${Date.now()}`
    )

    paymentResult.value = result
    console.log('Preferencia creada:', result)

    // Redirigir a MercadoPago después de 2 segundos
    setTimeout(() => {
      mercadoPagoService.redirectToCheckout(result.sandbox_init_point || result.init_point)
    }, 2000)

  } catch (err) {
    error.value = 'Error al crear la preferencia de pago. Verifica la consola.'
    console.error('Error al crear preferencia:', err)
  } finally {
    processing.value = false
  }
}

onMounted(() => {
  loadConfig()
  createStarField()
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

  const layers = [
    document.getElementById('stars')
  ]

  if (layers[0]) {
    const counts = [100]
    populate(layers[0], counts[0], 0.2)
  }
}
</script>
