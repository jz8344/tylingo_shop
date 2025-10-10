/**
 * Ejemplo de cómo usar los servicios de API en Home.vue
 * 
 * Este archivo muestra cómo reemplazar los datos estáticos
 * por llamadas reales a la API de Laravel
 */

// En el <script setup> o setup() de Home.vue:

import { ref, onMounted } from 'vue'
import { getDailyDeals, getProductsByGame, getFeaturedProducts } from '@/services/productService'
import { getAllPersonajes } from '@/services/personajeService'
import { getAllSkins } from '@/services/skinService'

// Estados reactivos
const dailyProducts = ref([])
const codProducts = ref([])
const featuredProducts = ref([])
const loading = ref(false)
const error = ref(null)

// Cargar productos diarios (ofertas)
async function loadDailyDeals() {
  try {
    loading.value = true
    const data = await getDailyDeals()
    dailyProducts.value = data
  } catch (err) {
    error.value = 'Error al cargar ofertas diarias'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Cargar productos de Call of Duty
async function loadCODProducts() {
  try {
    const data = await getProductsByGame('call of duty')
    codProducts.value = data
  } catch (err) {
    console.error('Error cargando productos COD:', err)
  }
}

// Cargar productos destacados
async function loadFeaturedProducts() {
  try {
    const data = await getFeaturedProducts()
    featuredProducts.value = data
  } catch (err) {
    console.error('Error cargando productos destacados:', err)
  }
}

// Cargar todos los productos al montar el componente
onMounted(async () => {
  await Promise.all([
    loadDailyDeals(),
    loadCODProducts(),
    loadFeaturedProducts()
  ])
})

// EJEMPLO DE BÚSQUEDA:
import { searchProducts } from '@/services/productService'

async function handleSearch(query) {
  if (!query) return
  try {
    const results = await searchProducts(query)
    console.log('Resultados de búsqueda:', results)
    // Actualizar la UI con los resultados
  } catch (err) {
    console.error('Error en búsqueda:', err)
  }
}

// EJEMPLO DE FILTROS:
import { getAllProducts } from '@/services/productService'

async function filterProductsByGame(game) {
  try {
    const data = await getAllProducts({ videojuego: game })
    return data
  } catch (err) {
    console.error(`Error filtrando por ${game}:`, err)
  }
}

async function filterProductsByCategory(category) {
  try {
    const data = await getAllProducts({ categoria: category })
    return data
  } catch (err) {
    console.error(`Error filtrando por ${category}:`, err)
  }
}

// Solo ofertas
async function loadOnlyDeals() {
  try {
    const data = await getAllProducts({ ofertas: 'true' })
    return data
  } catch (err) {
    console.error('Error cargando ofertas:', err)
  }
}

/**
 * EJEMPLO COMPLETO DE REEMPLAZO EN setup():
 */

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
    
    // Reemplazar arrays estáticos por refs vacíos
    const dailyProducts = ref([])
    const codProducts = ref([])
    const featuredProducts = ref([])
    const loading = ref(false)
    
    // Cargar datos reales de la API
    async function loadProducts() {
      try {
        loading.value = true
        
        // Cargar ofertas diarias
        const deals = await getDailyDeals()
        dailyProducts.value = deals
        
        // Cargar productos de Call of Duty
        const cod = await getProductsByGame('call of duty')
        codProducts.value = cod.slice(0, 3) // Tomar solo 3
        
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        loading.value = false
      }
    }
    
    // Cargar al montar
    onMounted(() => {
      loadProducts()
      initCountdown()
      createStarfield()
      
      if (window.feather) {
        window.feather.replace()
      }
    })
    
    return {
      selectedCategory,
      countdown,
      dailyProducts,
      codProducts,
      loading,
      // ... resto de métodos
    }
  }
}
