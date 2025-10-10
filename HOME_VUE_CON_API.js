/**
 * HOME.VUE - ACTUALIZACIÓN COMPLETA CON API
 * 
 * Este archivo muestra cómo actualizar Home.vue para usar la API real
 * en lugar de datos estáticos.
 * 
 * INSTRUCCIONES:
 * 1. Copia el código del <script setup> a tu Home.vue
 * 2. Las importaciones de servicios ya están listas
 * 3. Los métodos loadData() cargarán desde la API
 * 4. El template no necesita cambios (solo agregar loading states)
 */

// ============================================
// SECCIÓN <script setup> COMPLETA
// ============================================

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import FlashSaleCard from '@/components/FlashSaleCard.vue'
import LiveEvent from '@/components/LiveEvent.vue'
import WideProductCard from '@/components/WideProductCard.vue'

// ========== IMPORTAR SERVICIOS API ==========
import { getDailyDeals, getProductsByGame, getFeaturedProducts } from '@/services/productService'

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

    // ========== ESTADOS DE CARGA ==========
    const loading = ref(false)
    const loadingCOD = ref(false)
    const error = ref(null)

    // ========== DATOS REACTIVOS (Ahora desde API) ==========
    const dailyProducts = ref([])
    const codProducts = ref([])
    const featuredProducts = ref([])
    
    // Flash sales y eventos (estos pueden quedarse estáticos o moverlos a API)
    const flashSales = ref([
      { id: 1, title: 'SKIN BATTLE ROYALE', description: 'Pack de 3 skins exclusivas de temporada', price: 199, originalPrice: 450, discount: 56, timeLeft: '05:23', type: 'FLASH SALE' },
      { id: 2, title: 'ARSENAL COMPLETO', description: '5 armas legendarias + munición infinita', price: 349, originalPrice: 800, discount: 56, timeLeft: '12:45', type: 'ÚLTIMA OPORTUNIDAD' },
      { id: 3, title: 'PAQUETE ÉPICO', description: 'Incluye 2 skins épicas y 1 emote exclusivo', price: 149, originalPrice: 300, discount: 50, timeLeft: '08:15', type: 'FLASH SALE' }
    ])

    const liveEvents = ref([
      { id: 1, title: 'TORNEO SEMANAL', description: 'Compite y gana skins exclusivas', status: 'ACTIVO', participants: '2,547' },
      { id: 2, title: 'EVENTO ESPECIAL', description: 'Skins de colaboración limitada', status: 'ÚLTIMAS HORAS', participants: '—' }
    ])

    // Categories para filtros
    const categories = [
      'Populares', 'Celebridades', 'Gorillaz', 'Marvel', 'Dragon Ball Z', 'Star Wars'
    ]

    // ========== CARGAR DATOS DESDE API ==========
    
    /**
     * Cargar ofertas diarias desde la API
     */
    async function loadDailyDeals() {
      try {
        loading.value = true
        error.value = null
        
        const data = await getDailyDeals()
        dailyProducts.value = data
        
        console.log('✅ Ofertas diarias cargadas:', data.length, 'productos')
      } catch (err) {
        error.value = 'Error al cargar ofertas diarias'
        console.error('❌ Error cargando ofertas:', err)
        
        // Fallback a datos estáticos si falla la API
        dailyProducts.value = [
          { id: 1, name: 'Billie Eilish', description: 'Temática Verde Splash', price: 209, originalPrice: 299, discount: 30, image: '/img/jefem.png', rarity: 'LEGENDARIO', game: 'FORTNITE' },
          { id: 2, name: 'GUERRERO MANDALORIANO', description: 'Edición especial Star Wars', price: 1359, originalPrice: 1599, discount: 15, image: '/img/jefemb.png', rarity: 'LEGENDARIO', game: 'FORTNITE' }
        ]
      } finally {
        loading.value = false
      }
    }

    /**
     * Cargar productos de Call of Duty
     */
    async function loadCODProducts() {
      try {
        loadingCOD.value = true
        
        const data = await getProductsByGame('call of duty')
        codProducts.value = data.slice(0, 3) // Tomar solo 3 productos
        
        console.log('✅ Productos COD cargados:', data.length, 'productos')
      } catch (err) {
        console.error('❌ Error cargando productos COD:', err)
        
        // Fallback a datos estáticos
        codProducts.value = [
          { id: 1, name: 'OPERACIÓN MODER', description: 'Paquete premium con operador', price: 419, originalPrice: 599, discount: 30, image: '/img/callofduty/cer_bundle_billboard_15320_moder.png', game: 'CALL OF DUTY' }
        ]
      } finally {
        loadingCOD.value = false
      }
    }

    /**
     * Cargar productos destacados
     */
    async function loadFeaturedProducts() {
      try {
        const data = await getFeaturedProducts()
        featuredProducts.value = data
        
        console.log('✅ Productos destacados cargados:', data.length)
      } catch (err) {
        console.error('❌ Error cargando destacados:', err)
      }
    }

    /**
     * Cargar todos los datos al iniciar
     */
    async function loadAllData() {
      console.log('🔄 Cargando datos desde API...')
      
      await Promise.all([
        loadDailyDeals(),
        loadCODProducts(),
        loadFeaturedProducts()
      ])
      
      console.log('✅ Todos los datos cargados')
    }

    // ========== COMPUTED PROPERTIES ==========
    
    const filteredProducts = computed(() => {
      if (selectedCategory.value === 'Populares') {
        return dailyProducts.value
      }
      
      // Filtrar por categoría
      return dailyProducts.value.filter(product => {
        return product.categoria?.toLowerCase() === selectedCategory.value.toLowerCase()
      })
    })

    // ========== MÉTODOS DE UI ==========

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
      console.log('🛒 Agregar al carrito:', product.name || product.nombre)
      // TODO: Implementar lógica del carrito
    }

    const toggleFavorite = (product) => {
      console.log('❤️ Toggle favorito:', product.name || product.nombre)
      // TODO: Implementar lógica de favoritos
    }

    const buyBundle = () => {
      console.log('💰 Comprar bundle')
      // TODO: Implementar lógica de compra
    }

    const purchaseFlashSale = (sale) => {
      console.log('⚡ Comprar flash sale:', sale.title)
      // TODO: Implementar lógica de compra flash
    }

    const participateEvent = (event) => {
      console.log('🎮 Participar en evento:', event.title)
      // TODO: Implementar lógica de participación
    }

    // ========== LIFECYCLE HOOKS ==========

    onMounted(async () => {
      console.log('🚀 Home.vue montado - Iniciando carga de datos...')
      
      // Cargar datos de la API
      await loadAllData()
      
      // Inicializar UI
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

    // ========== RETURN ==========
    
    return {
      // Estados
      selectedCategory,
      countdown,
      loading,
      loadingCOD,
      error,
      
      // Datos
      dailyProducts,
      codProducts,
      featuredProducts,
      flashSales,
      liveEvents,
      categories,
      
      // Computed
      filteredProducts,
      
      // Métodos
      exploreProducts,
      addToCart,
      toggleFavorite,
      buyBundle,
      purchaseFlashSale,
      participateEvent,
      loadAllData // Para poder recargar manualmente
    }
  }
}

// ============================================
// CAMBIOS EN EL TEMPLATE (OPCIONALES)
// ============================================

/*
En el template, puedes agregar indicadores de carga:

<!-- Ofertas Diarias con Loading -->
<section class="py-16 container mx-auto px-4">
  <h2 class="text-4xl font-bold mb-8">OFERTAS DIARIAS</h2>
  
  <!-- Loading State -->
  <div v-if="loading" class="text-center py-12">
    <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-unsc mx-auto"></div>
    <p class="mt-4 text-blue-300">Cargando ofertas...</p>
  </div>
  
  <!-- Error State -->
  <div v-else-if="error" class="glass-card p-8 text-center">
    <p class="text-red-400">{{ error }}</p>
    <button @click="loadAllData" class="btn-unsc mt-4">
      Reintentar
    </button>
  </div>
  
  <!-- Products Grid -->
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    <ProductCard
      v-for="product in dailyProducts"
      :key="product.id"
      :product="product"
      @add-to-cart="addToCart"
      @toggle-favorite="toggleFavorite"
    />
  </div>
</section>

<!-- Call of Duty con Loading -->
<section class="py-16 container mx-auto px-4">
  <h2 class="text-4xl font-bold mb-8">CALL OF DUTY</h2>
  
  <div v-if="loadingCOD" class="text-center py-8">
    <p class="text-blue-300">Cargando productos...</p>
  </div>
  
  <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <WideProductCard
      v-for="product in codProducts"
      :key="product.id"
      :product="product"
      @add-to-cart="addToCart"
    />
  </div>
</section>
*/

// ============================================
// NOTAS IMPORTANTES
// ============================================

/*
1. ✅ Los datos ahora se cargan desde la API Laravel
2. ✅ Hay fallback a datos estáticos si falla la API
3. ✅ Loading states implementados
4. ✅ Error handling incluido
5. ✅ Console logs para debugging
6. ✅ Promise.all para cargar datos en paralelo
7. ⚠️  Asegúrate de que el backend esté corriendo (php artisan serve)
8. ⚠️  Verifica que .env tenga VITE_API_URL=http://localhost:8000/api/v1

TESTING:
1. Inicia el backend: cd backend && php artisan serve
2. Inicia el frontend: cd tylingo_shop && npm run dev
3. Abre http://localhost:5173
4. Abre F12 > Console para ver los logs
5. Abre F12 > Network para ver las peticiones API
*/
