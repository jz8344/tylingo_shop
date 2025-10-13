<template>
  <!-- Fondo estelar -->
  <div id="stars"></div>
  <div id="stars2"></div>
  <div id="stars3"></div>
  
  <section class="py-16 container mx-auto px-4" style="z-index: 10; position: relative;">
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold unsc-title">Fortnite</h1>
      <p class="text-blue-300 mt-2">Catálogo desde la base de datos</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      <p class="mt-4 text-blue-300 text-lg">Cargando productos de Fortnite...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="glass-card p-8 text-center">
      <p class="text-red-400 mb-4">{{ error }}</p>
      <button @click="loadFortniteProducts" class="btn-unsc px-6 py-3">
        <i data-feather="refresh-cw" class="inline mr-2"></i>
        Reintentar
      </button>
    </div>
    
    <!-- Products Grid -->
    <div v-else-if="fortniteProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <FortniteProductCard
        v-for="product in fortniteProducts"
        :key="product.id"
        :product="product"
        @add-to-cart="addToCart"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="glass-card p-12 text-center">
      <p class="text-blue-300 text-lg">No hay productos de Fortnite disponibles.</p>
      <p class="text-blue-400 mt-2">Agrega productos desde el panel de administración.</p>
    </div>
  </section>
</template>
<script>
import { ref, onMounted } from 'vue'
import FortniteProductCard from '@/components/FortniteProductCard.vue'
import { getProductsByGame } from '@/services/productService'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

export default {
  name: 'Fortnite',
  components: {
    FortniteProductCard
  },
  setup() {
    const cartStore = useCartStore()
    const router = useRouter()
    const fortniteProducts = ref([])
    const loading = ref(false)
    const error = ref(null)

    async function loadFortniteProducts() {
      try {
        loading.value = true
        error.value = null
        console.log('Cargando productos de Fortnite desde API...')
        
        const data = await getProductsByGame('fortnite')
        
        fortniteProducts.value = data.map(product => ({
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
            { text: product.videojuego?.toUpperCase() || 'FORTNITE', class: 'bg-blue-600' },
            { text: product.rareza?.toUpperCase() || 'COMUN', class: getRarityClass(product.rareza || 'comun') }
          ]
        }))
        
        console.log('Productos de Fortnite cargados:', fortniteProducts.value.length)
      } catch (err) {
        error.value = 'Error al cargar productos de Fortnite'
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
      // Convertir el formato del producto para el carrito
      const cartItem = {
        id: product.id,
        nombre: product.name,
        descripcion: product.description || product.name,
        precio: product.originalPrice || product.price,
        precio_oferta: product.originalPrice ? product.price : null,
        videojuego: 'Fortnite',
        imagen_url: product.image,
        imagen_path: product.image
      }
      
      const added = cartStore.addToCart(cartItem)
      if (added) {
        alert(`✅ ${product.name} agregado al carrito`)
        // Opcional: redirigir al carrito
        // router.push('/cart')
      }
    }

    onMounted(async () => {
      await loadFortniteProducts()
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
      fortniteProducts,
      loading,
      error,
      addToCart,
      loadFortniteProducts
    }
  }
}
</script>

<style scoped>
/* Los estilos de starfield están en global.css para evitar conflictos de scoping */

#stars::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 20% 20%, rgba(0, 191, 255, 0.08) 0%, transparent 25%),
              radial-gradient(ellipse at 80% 70%, rgba(0, 128, 255, 0.06) 0%, transparent 30%);
  mix-blend-mode: screen;
  filter: blur(30px) saturate(120%);
}

.star {
  position: absolute;
  background: #fff;
  border-radius: 50%;
  width: var(--size, 2px);
  height: var(--size, 2px);
  opacity: var(--opacity, 0.9);
  transform: translate3d(0, 0, 0);
  will-change: transform, opacity;
  box-shadow: 0 0 calc(var(--size, 2px) * 2) rgba(0, 191, 255, 0.6);
  animation: twinkle var(--twinkle, 3s) linear infinite;
}

.star.cold {
  background: #00BFFF;
  box-shadow: 0 0 6px rgba(0, 191, 255, 0.8);
}

.star.warm {
  background: #0080FF;
  box-shadow: 0 0 8px rgba(0, 128, 255, 0.6);
}

@keyframes twinkle {
  0% {
    opacity: calc(var(--opacity, 0.9) * 0.3);
    transform: scale(0.9);
  }
  50% {
    opacity: var(--opacity, 0.95);
    transform: scale(1.15);
  }
  100% {
    opacity: calc(var(--opacity, 0.9) * 0.4);
    transform: scale(0.95);
  }
}
</style>
