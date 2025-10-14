<template>
  <div class="glass-card p-6 mb-8 rounded-lg">
    <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      <!-- Título y contador -->
      <div class="flex items-center space-x-4">
        <h3 class="text-lg font-bold text-blue-200">
          <i data-feather="filter" class="inline w-5 h-5 mr-2"></i>
          Filtros y Ordenamiento
        </h3>
        <span class="px-3 py-1 bg-unsc/20 text-cyan-300 text-sm rounded-full">
          {{ totalProducts }} producto{{ totalProducts !== 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Botón Reset -->
      <button 
        @click="resetFilters"
        class="btn-unsc-sm px-4 py-2 text-xs"
        title="Resetear filtros"
      >
        <i data-feather="refresh-cw" class="w-4 h-4 mr-1"></i>
        Reset
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <!-- Ordenamiento -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-blue-300">
          <i data-feather="arrow-up-down" class="inline w-4 h-4 mr-1"></i>
          Ordenar por
        </label>
        <select 
          v-model="localFilters.sortBy" 
          @change="emitFiltersChange"
          class="w-full px-3 py-2 bg-unsc/10 border border-unsc/30 rounded text-blue-200 text-sm focus:outline-none focus:border-cyan-300"
        >
          <option value="default">Por defecto</option>
          <option value="name-asc">Nombre A-Z</option>
          <option value="name-desc">Nombre Z-A</option>
          <option value="price-asc">Precio menor a mayor</option>
          <option value="price-desc">Precio mayor a menor</option>
          <option value="date-desc">Más recientes</option>
          <option value="date-asc">Más antiguos</option>
        </select>
      </div>

      <!-- Filtro por ofertas -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-blue-300">
          <i data-feather="tag" class="inline w-4 h-4 mr-1"></i>
          Ofertas
        </label>
        <select 
          v-model="localFilters.showOffers" 
          @change="emitFiltersChange"
          class="w-full px-3 py-2 bg-unsc/10 border border-unsc/30 rounded text-blue-200 text-sm focus:outline-none focus:border-cyan-300"
        >
          <option value="all">Todos</option>
          <option value="offers">Solo ofertas</option>
          <option value="no-offers">Sin ofertas</option>
        </select>
      </div>

      <!-- Filtro por rareza -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-blue-300">
          <i data-feather="star" class="inline w-4 h-4 mr-1"></i>
          Rareza
        </label>
        <select 
          v-model="localFilters.rarity" 
          @change="emitFiltersChange"
          class="w-full px-3 py-2 bg-unsc/10 border border-unsc/30 rounded text-blue-200 text-sm focus:outline-none focus:border-cyan-300"
        >
          <option value="all">Todas</option>
          <option value="comun">Común</option>
          <option value="raro">Raro</option>
          <option value="epico">Épico</option>
          <option value="legendario">Legendario</option>
          <option value="mitico">Mítico</option>
        </select>
      </div>

      <!-- Filtro por tipo (solo si aplica) -->
      <div class="space-y-2" v-if="availableTypes.length > 0">
        <label class="block text-sm font-medium text-blue-300">
          <i data-feather="layers" class="inline w-4 h-4 mr-1"></i>
          Tipo
        </label>
        <select 
          v-model="localFilters.type" 
          @change="emitFiltersChange"
          class="w-full px-3 py-2 bg-unsc/10 border border-unsc/30 rounded text-blue-200 text-sm focus:outline-none focus:border-cyan-300"
        >
          <option value="all">Todos</option>
          <option v-for="type in availableTypes" :key="type" :value="type">
            {{ formatType(type) }}
          </option>
        </select>
      </div>
    </div>

    <!-- Búsqueda local -->
    <div class="mt-4">
      <label class="block text-sm font-medium text-blue-300 mb-2">
        <i data-feather="search" class="inline w-4 h-4 mr-1"></i>
        Buscar en esta página
      </label>
      <input 
        v-model="localFilters.searchTerm"
        @input="emitFiltersChange"
        type="text"
        placeholder="Buscar por nombre o descripción..."
        class="w-full px-4 py-2 bg-unsc/10 border border-unsc/30 rounded text-blue-200 placeholder-blue-400 focus:outline-none focus:border-cyan-300"
      >
    </div>

    <!-- Filtros activos -->
    <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
      <span class="text-sm text-blue-300">Filtros activos:</span>
      
      <span v-if="localFilters.sortBy !== 'default'" class="px-2 py-1 bg-cyan-600/20 text-cyan-300 text-xs rounded-full">
        {{ getSortLabel(localFilters.sortBy) }}
      </span>
      
      <span v-if="localFilters.showOffers !== 'all'" class="px-2 py-1 bg-orange-600/20 text-orange-300 text-xs rounded-full">
        {{ getOffersLabel(localFilters.showOffers) }}
      </span>
      
      <span v-if="localFilters.rarity !== 'all'" class="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full">
        {{ localFilters.rarity.charAt(0).toUpperCase() + localFilters.rarity.slice(1) }}
      </span>
      
      <span v-if="localFilters.type !== 'all'" class="px-2 py-1 bg-green-600/20 text-green-300 text-xs rounded-full">
        {{ formatType(localFilters.type) }}
      </span>
      
      <span v-if="localFilters.searchTerm" class="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full">
        "{{ localFilters.searchTerm }}"
      </span>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'

export default {
  name: 'ProductFilters',
  props: {
    totalProducts: {
      type: Number,
      default: 0
    },
    availableTypes: {
      type: Array,
      default: () => []
    },
    initialFilters: {
      type: Object,
      default: () => ({
        sortBy: 'default',
        showOffers: 'all',
        rarity: 'all',
        type: 'all',
        searchTerm: ''
      })
    }
  },
  emits: ['filters-changed'],
  setup(props, { emit }) {
    const localFilters = ref({
      sortBy: 'default',
      showOffers: 'all',
      rarity: 'all',
      type: 'all',
      searchTerm: ''
    })

    const hasActiveFilters = computed(() => {
      return localFilters.value.sortBy !== 'default' ||
             localFilters.value.showOffers !== 'all' ||
             localFilters.value.rarity !== 'all' ||
             localFilters.value.type !== 'all' ||
             localFilters.value.searchTerm !== ''
    })

    const emitFiltersChange = () => {
      emit('filters-changed', { ...localFilters.value })
    }

    const resetFilters = () => {
      localFilters.value = {
        sortBy: 'default',
        showOffers: 'all',
        rarity: 'all',
        type: 'all',
        searchTerm: ''
      }
      emitFiltersChange()
    }

    const getSortLabel = (sortBy) => {
      const labels = {
        'name-asc': 'A-Z',
        'name-desc': 'Z-A',
        'price-asc': 'Precio ↑',
        'price-desc': 'Precio ↓',
        'date-desc': 'Recientes',
        'date-asc': 'Antiguos'
      }
      return labels[sortBy] || sortBy
    }

    const getOffersLabel = (showOffers) => {
      const labels = {
        'offers': 'Solo ofertas',
        'no-offers': 'Sin ofertas'
      }
      return labels[showOffers] || showOffers
    }

    const formatType = (type) => {
      const typeMap = {
        'personaje': 'Personajes',
        'skin': 'Skins',
        'avatar': 'Avatares',
        'moneda': 'Monedas',
        'objeto': 'Objetos',
        'dlc': 'DLC',
        'pack': 'Packs'
      }
      return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1)
    }

    // Inicializar con filtros iniciales
    watch(() => props.initialFilters, (newFilters) => {
      localFilters.value = { ...localFilters.value, ...newFilters }
    }, { immediate: true })

    onMounted(() => {
      if (window.feather) {
        window.feather.replace()
      }
    })

    return {
      localFilters,
      hasActiveFilters,
      emitFiltersChange,
      resetFilters,
      getSortLabel,
      getOffersLabel,
      formatType
    }
  }
}
</script>

<style scoped>
select:focus {
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

input:focus {
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}
</style>