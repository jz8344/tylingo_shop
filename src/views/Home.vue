<template>
  <div class="home-view">
    <!-- Fondo estelar UNSC -->
    <div id="stars"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>

    <!-- Hero Section UNSC -->
    <section class="relative py-20">
      <div class="container mx-auto px-4">
        <div class="glass-card p-12 text-center max-w-4xl mx-auto">
          <div class="flex justify-center mb-6">
            <div class="w-20 h-20 glass-card flex items-center justify-center unsc-hover">
              <i data-feather="zap" class="text-unsc w-10 h-10"></i>
            </div>
          </div>
          <h2 class="text-4xl md:text-6xl font-bold mb-6 unsc-title">
            GAME SHOP
          </h2>
          <p class="text-xl md:text-2xl mb-8 text-blue-200 font-medium">
            BIENVENIDO A GAME SHOP TU DESTINO DE JUEGOS, AQUI ENCONTRARAS Y PODRAS ADQUIRIR DIVERSAS SKINS, ARMAS Y ACCESORIOS DE FORTNITE
          </p>
          <p class="text-lg mb-8 text-blue-300 max-w-2xl mx-auto">
            Explora nuestra amplia gama de productos y mejora tu experiencia de juego.
          </p>
          <button class="btn-unsc px-8 py-4 rounded-lg text-lg" @click="exploreProducts">
            <i data-feather="shield" class="inline mr-2"></i>
            EXPLORAR
          </button>
        </div>
      </div>
    </section>

    <!-- UNSC Daily Requisitions -->
    <section class="py-16 container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center mb-12">
        <h2 class="text-4xl font-bold mb-6 md:mb-0 unsc-title">
          OFERTAS DIARIAS
        </h2>
        <div class="glass-card px-8 py-4 flex items-center space-x-4">
          <i data-feather="clock" class="text-unsc"></i>
          <div class="text-center font-orbitron text-2xl font-bold">
            <span class="text-unsc">{{ countdown.hours }}</span>:<span class="text-unsc">{{ countdown.minutes }}</span>:<span class="text-unsc">{{ countdown.seconds }}</span>
          </div>
          <span class="text-sm text-blue-300 uppercase tracking-wider">TIEMPO RESTANTE</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <!-- Products Grid -->
        <ProductCard
          v-for="product in dailyProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="addToCart"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </section>

    <!-- UNSC Special Operations -->
    <section class="py-20 container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-5xl font-bold mb-6 unsc-title">
          OPERACIONES ESPECIALES
        </h2>
        <p class="text-xl text-blue-200 max-w-3xl mx-auto uppercase tracking-wide">
          Ofertas limitadas, bundles exclusivos y eventos únicos disponibles por tiempo limitado
        </p>
      </div>

      <!-- Featured Bundle -->
      <div class="glass-card p-8 rounded-xl mb-12 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-unsc/10 via-blue-500/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        <div class="relative z-10">
          <div class="flex flex-col lg:flex-row items-center gap-12">
            <div class="flex-1">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 glass-card flex items-center justify-center">
                  <i data-feather="package" class="text-unsc w-8 h-8"></i>
                </div>
                <div class="bg-red-600 text-white text-sm px-4 py-2 rounded-full font-bold uppercase animate-pulse">OFERTA LIMITADA</div>
              </div>
              <h3 class="text-4xl font-bold mb-4 text-blue-100 uppercase tracking-wide">PACK LEGENDARIO COMPLETO</h3>
              <p class="text-blue-300 mb-6 text-lg leading-relaxed">
                Incluye 4 skins legendarias, armas exclusivas, emotes únicos y 2000 V-Bucks.
                La mejor oferta del año por tiempo limitado.
              </p>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="glass-card p-3 text-center">
                  <i data-feather="user" class="text-unsc w-6 h-6 mx-auto mb-2"></i>
                  <p class="text-xs text-blue-300 uppercase">4 Skins</p>
                </div>
                <div class="glass-card p-3 text-center">
                  <i data-feather="crosshair" class="text-unsc w-6 h-6 mx-auto mb-2"></i>
                  <p class="text-xs text-blue-300 uppercase">6 Armas</p>
                </div>
                <div class="glass-card p-3 text-center">
                  <i data-feather="music" class="text-unsc w-6 h-6 mx-auto mb-2"></i>
                  <p class="text-xs text-blue-300 uppercase">8 Emotes</p>
                </div>
                <div class="glass-card p-3 text-center">
                  <i data-feather="dollar-sign" class="text-unsc w-6 h-6 mx-auto mb-2"></i>
                  <p class="text-xs text-blue-300 uppercase">2000 V-Bucks</p>
                </div>
              </div>

              <div class="flex items-center gap-6 mb-6">
                <div>
                  <span class="text-gray-400 line-through text-2xl">$2,999 MXN</span>
                  <span class="text-4xl font-bold text-unsc ml-4">$1,499 MXN</span>
                </div>
                <div class="bg-green-600 text-white text-sm px-3 py-1 rounded-full font-bold">
                  AHORRA 50%
                </div>
              </div>

              <button class="btn-unsc px-8 py-4 rounded-lg text-lg w-full md:w-auto" @click="buyBundle">
                <i data-feather="shopping-cart" class="inline mr-2"></i>
                COMPRAR PACK
              </button>
            </div>
            
            <div class="flex-1 grid grid-cols-2 gap-4">
              <img src="/img/jefem.png" alt="Bundle Item" class="w-full h-42 object-cover rounded-lg border border-unsc/30">
              <img src="/img/videoframe_0.png" alt="Bundle Item" class="w-full h-42 object-cover rounded-lg border border-unsc/30">
              <img src="/img/himiko.png" alt="Bundle Item" class="w-full h-42 object-cover rounded-lg border border-unsc/30">
              <img src="/img/gokub.png" alt="Bundle Item" class="w-full h-42 object-cover rounded-lg border border-unsc/30">
            </div>
          </div>
        </div>
      </div>

      <!-- Flash Sales Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <!-- Flash Sales -->
        <FlashSaleCard
          v-for="sale in flashSales"
          :key="sale.id"
          :sale="sale"
          @purchase="purchaseFlashSale"
        />
      </div>

      <!-- Live Events -->
      <div class="glass-card p-8 rounded-xl">
        <h3 class="text-3xl font-bold text-center mb-8 unsc-title">EVENTOS EN VIVO</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <LiveEvent
            v-for="event in liveEvents"
            :key="event.id"
            :event="event"
            @participate="participateEvent"
          />
        </div>
      </div>
    </section>

    <!-- Featured Games -->
    <section class="py-12 container mx-auto px-4">
      <h2 class="text-3xl font-bold mb-8">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-neon-pink to-primary">DESTACADOS POR JUEGO</span>
      </h2>
      
      <div class="mb-6 flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'whitespace-nowrap px-4 py-2 rounded-full transition',
            selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-800 hover:bg-gray-700'
          ]"
        >
          {{ category }}
        </button>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="addToCart"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </section>

    <!-- Call of Duty Wide Cards Section -->
    <section class="py-16 container mx-auto px-4">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <h2 class="text-4xl font-bold unsc-title">CALL OF DUTY - SELECCIÓN ESPECIAL</h2>
        <p class="text-blue-300 uppercase tracking-wider text-sm">Tarjetas más anchas tipo billboard</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WideProductCard
          v-for="product in codProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import FlashSaleCard from '@/components/FlashSaleCard.vue'
import LiveEvent from '@/components/LiveEvent.vue'
import WideProductCard from '@/components/WideProductCard.vue'

export default {
  name: 'Home',
  components: {
    ProductCard,
    FlashSaleCard,
    LiveEvent,
    WideProductCard
  },
  setup() {
    const router = useRouter()
    const selectedCategory = ref('Populares')
    const countdown = ref({ hours: '00', minutes: '00', seconds: '00' })
    let countdownInterval = null

    // Categories for filter
    const categories = [
      'Populares', 'Celebridades', 'Gorillaz', 'Marvel', 'Dragon Ball Z', 'Star Wars'
    ]

    // Sample data for daily products
    const dailyProducts = ref([
      {
        id: 1,
        name: 'Billie Eilish',
        description: 'Temática Verde Splash',
        price: 249,
        originalPrice: 349,
        discount: 30,
        image: '/img/jefem.png',
        rarity: 'LEGENDARIO',
        game: 'FORTNITE'
      },
      {
        id: 2,
        name: 'GUERRERO MANDALORIANO',
        description: 'Edición especial Star Wars',
        price: 299,
        originalPrice: 399,
        discount: 15,
        image: '/img/jefemb.png',
        rarity: 'ÉPICO',
        game: 'FORTNITE'
      },
      // ... más productos
    ])

    // Flash sales data
    const flashSales = ref([
      {
        id: 1,
        title: 'SKIN BATTLE ROYALE',
        description: 'Pack de 3 skins exclusivas de temporada',
        price: 199,
        originalPrice: 449,
        discount: 56,
        timeLeft: '05:23',
        type: 'FLASH SALE'
      },
      // ... más flash sales
    ])

    // Live events data
    const liveEvents = ref([
      {
        id: 1,
        title: 'TORNEO SEMANAL',
        description: 'Compite y gana skins exclusivas',
        status: 'En progreso',
        participants: '2,547 jugadores'
      },
      // ... más eventos
    ])

    // COD Products
    const codProducts = ref([
      {
        id: 1,
        name: 'OPERACIÓN MODER',
        description: 'Paquete premium con operador, planos y emblemas animados.',
        price: 599,
        originalPrice: 849,
        discount: 30,
        image: '/img/callofduty/cer_bundle_billboard_15320_moder.png',
        game: 'CALL OF DUTY'
      },
      // ... más productos COD
    ])

    // Computed properties
    const filteredProducts = computed(() => {
      // Filtrar productos según la categoría seleccionada
      return dailyProducts.value.filter(product => {
        if (selectedCategory.value === 'Populares') return true
        // Implementar lógica de filtrado según categoría
        return true
      })
    })

    // Methods
    const initCountdown = () => {
      const endTime = new Date()
      endTime.setHours(endTime.getHours() + 24)
      
      const updateCountdown = () => {
        const now = new Date()
        const diff = endTime - now
        
        if (diff <= 0) {
          countdown.value = { hours: '00', minutes: '00', seconds: '00' }
          return
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        
        countdown.value = {
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0')
        }
      }
      
      updateCountdown()
      countdownInterval = setInterval(updateCountdown, 1000)
    }

    const createStarfield = () => {
      const createStar = (layer, opts = {}) => {
        const star = document.createElement('div')
        star.className = 'star'
        if (opts.variant) star.classList.add(opts.variant)
        star.style.setProperty('--size', (opts.size || (Math.random() * 2 + 1)) + 'px')
        star.style.setProperty('--opacity', (opts.opacity || (Math.random() * 0.6 + 0.4)))
        star.style.setProperty('--twinkle', (opts.twinkle || (Math.random() * 4 + 2)) + 's')
        star.style.left = (Math.random() * 100) + '%'
        star.style.top = (Math.random() * 100) + '%'
        return star
      }

      const populate = (layer, count, variantChance) => {
        const frag = document.createDocumentFragment()
        for (let i = 0; i < count; i++) {
          const variant = Math.random() < variantChance ? (Math.random() < 0.7 ? 'cold' : 'warm') : null
          frag.appendChild(createStar(layer, { variant }))
        }
        layer.appendChild(frag)
      }

      const layers = [
        document.getElementById('stars'),
        document.getElementById('stars2'),
        document.getElementById('stars3')
      ]

      const density = Math.max(1, Math.min(2.2, (window.innerWidth * window.innerHeight) / (1280 * 720)))
      const counts = [120, 80, 40].map(n => Math.round(n * density))

      if (layers[0]) populate(layers[0], counts[0], 0.2)
      if (layers[1]) populate(layers[1], counts[1], 0.3)
      if (layers[2]) populate(layers[2], counts[2], 0.4)
    }

    const exploreProducts = () => {
      router.push('/fortnite')
    }

    const addToCart = (product) => {
      console.log('Adding to cart:', product)
      // Implementar lógica del carrito
    }

    const toggleFavorite = (product) => {
      console.log('Toggle favorite:', product)
      // Implementar lógica de favoritos
    }

    const buyBundle = () => {
      console.log('Buying bundle')
      // Implementar lógica de compra
    }

    const purchaseFlashSale = (sale) => {
      console.log('Purchasing flash sale:', sale)
      // Implementar lógica de compra flash
    }

    const participateEvent = (event) => {
      console.log('Participating in event:', event)
      // Implementar lógica de participación en evento
    }

    onMounted(() => {
      initCountdown()
      createStarfield()
      
      // Inicializar iconos de Feather
      if (window.feather) {
        window.feather.replace()
      }
    })

    onUnmounted(() => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    })

    return {
      selectedCategory,
      categories,
      countdown,
      dailyProducts,
      flashSales,
      liveEvents,
      codProducts,
      filteredProducts,
      exploreProducts,
      addToCart,
      toggleFavorite,
      buyBundle,
      purchaseFlashSale,
      participateEvent
    }
  }
}
</script>