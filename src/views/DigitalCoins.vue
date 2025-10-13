<template>
  <!-- Fondo estelar -->
  <div id="stars"></div>
  <div id="stars2"></div>
  <div id="stars3"></div>
  
  <section class="py-16 container mx-auto px-4">
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold unsc-title">Monedas Digitales</h1>
      <p class="text-blue-300 mt-2">V-Bucks, COD Points y más</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      <p class="mt-4 text-blue-300 text-lg">Cargando monedas digitales...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="glass-card p-8 text-center">
      <p class="text-red-400 mb-4">{{ error }}</p>
      <button @click="loadDigitalCoins" class="btn-unsc px-6 py-3">
        <i data-feather="refresh-cw" class="inline mr-2"></i>
        Reintentar
      </button>
    </div>
    
    <!-- Products Grid -->
    <div v-else-if="coins.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <FortniteProductCard
        v-for="product in coins"
        :key="product.id"
        :product="product"
        @add-to-cart="addToCart"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="glass-card p-12 text-center">
      <p class="text-blue-300 text-lg">No hay monedas digitales disponibles.</p>
      <p class="text-blue-400 mt-2">Agrega productos desde el panel de administración.</p>
    </div>
  </section>
</template>
<script>
import { ref, onMounted } from 'vue'
import FortniteProductCard from '@/components/FortniteProductCard.vue'
import { getAllProducts } from '@/services/productService'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'DigitalCoins',
  components: {
    FortniteProductCard
  },
  setup() {
    const coins = ref([])
    const loading = ref(false)
    const error = ref(null)
    const cartStore = useCartStore()

    async function loadDigitalCoins() {
      try {
        loading.value = true
        error.value = null
        console.log('Cargando monedas digitales desde API...')
        
        const data = await getAllProducts()
        
        // Filtrar solo productos de tipo 'moneda'
        const monedas = data.filter(product => product.tipo === 'moneda')
        
        coins.value = monedas.map(product => ({
          id: product.id,
          name: product.nombre,
          description: product.descripcion || '',
          price: product.precio_oferta || product.precio,
          originalPrice: product.precio,
          discount: product.es_oferta ? Math.round(((product.precio - (product.precio_oferta || product.precio)) / product.precio) * 100) : 0,
          image: product.imagen_url || product.imagen_path || '/img/default.png',
          newBadge: product.etiqueta === 'NUEVO' ? 'NUEVO' : null,
          specialBadge: product.rareza ? { text: product.rareza.toUpperCase(), class: getRarityClass(product.rareza) } : null,
          tags: [
            { text: product.videojuego?.toUpperCase() || 'DIGITAL', class: 'bg-green-600' },
            { text: 'MONEDA', class: 'bg-yellow-600' }
          ]
        }))
        
        console.log('Monedas digitales cargadas:', coins.value.length)
      } catch (err) {
        error.value = 'Error al cargar monedas digitales'
        console.error('Error:', err)
      } finally {
        loading.value = false
      }
    }

    function getRarityClass(rareza) {
      const rarityMap = {
        'comun': 'bg-gray-600',
        'raro': 'bg-blue-600',
        'epico': 'bg-purple-600',
        'legendario': 'bg-orange-600',
        'mitico': 'bg-yellow-600'
      }
      return rarityMap[rareza?.toLowerCase()] || 'bg-gray-600'
    }

    const addToCart = (product) => {
      const cartItem = {
        id: product.id,
        nombre: product.name,
        descripcion: product.description || product.name,
        precio: product.originalPrice || product.price,
        precio_oferta: product.originalPrice ? product.price : null,
        tipo: 'moneda',
        videojuego: product.videojuego || 'Digital Coins',
        imagen_url: product.image,
        imagen_path: product.image
      }
      
      const added = cartStore.addToCart(cartItem)
      if (added) {
        alert(`✅ ${product.name} agregado al carrito`)
      }
    }

    onMounted(async () => {
      await loadDigitalCoins()
      createStarField()
      if (window.feather) {
        window.feather.replace()
      }
    })

    const createStarField = () => {
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

      const layers = [document.getElementById('stars'), document.getElementById('stars2'), document.getElementById('stars3')]
      if (layers[0]) {
        const density = Math.max(1, Math.min(2.2, (window.innerWidth * window.innerHeight) / (1280 * 720)))
        const counts = [120, 80, 40].map(n => Math.round(n * density))
        populate(layers[0], counts[0], 0.2)
        populate(layers[1], counts[1], 0.3)
        populate(layers[2], counts[2], 0.4)
      }
    }

    return {
      coins,
      loading,
      error,
      addToCart,
      loadDigitalCoins
    }
  }
}
</script>

<style scoped>
/* Los estilos de starfield están en global.css para evitar conflictos de scoping */
</style>
