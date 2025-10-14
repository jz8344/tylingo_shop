import { ref, computed } from 'vue'

export function useProductFilters(products) {
  const filters = ref({
    sortBy: 'default',
    showOffers: 'all',
    rarity: 'all',
    type: 'all',
    searchTerm: ''
  })

  const filteredAndSortedProducts = computed(() => {
    let result = [...products.value]

    // Aplicar filtro de búsqueda
    if (filters.value.searchTerm) {
      const searchTerm = filters.value.searchTerm.toLowerCase()
      result = result.filter(product => 
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      )
    }

    // Aplicar filtro de ofertas
    if (filters.value.showOffers === 'offers') {
      result = result.filter(product => product.discount > 0)
    } else if (filters.value.showOffers === 'no-offers') {
      result = result.filter(product => product.discount === 0)
    }

    // Aplicar filtro de rareza
    if (filters.value.rarity !== 'all') {
      result = result.filter(product => {
        const productRarity = product.specialBadge?.text?.toLowerCase() || 
                             product.badge?.text?.toLowerCase() ||
                             'comun'
        return productRarity === filters.value.rarity
      })
    }

    // Aplicar filtro de tipo
    if (filters.value.type !== 'all') {
      result = result.filter(product => {
        // Buscar el tipo en las tags del producto
        const productType = product.tags?.find(tag => 
          ['PERSONAJE', 'SKIN', 'AVATAR', 'MONEDA', 'OBJETO', 'DLC', 'PACK'].includes(tag.text)
        )?.text?.toLowerCase()
        return productType === filters.value.type
      })
    }

    // Aplicar ordenamiento
    switch (filters.value.sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'date-desc':
        // Ordenar por fecha de publicación (más recientes primero)
        result.sort((a, b) => {
          const dateA = new Date(a.publishDate || a.fecha_publicacion || 0)
          const dateB = new Date(b.publishDate || b.fecha_publicacion || 0)
          return dateB - dateA
        })
        break
      case 'date-asc':
        // Ordenar por fecha de publicación (más antiguos primero)
        result.sort((a, b) => {
          const dateA = new Date(a.publishDate || a.fecha_publicacion || 0)
          const dateB = new Date(b.publishDate || b.fecha_publicacion || 0)
          return dateA - dateB
        })
        break
      default:
        // Mantener orden por defecto
        break
    }

    return result
  })

  const availableTypes = computed(() => {
    const types = new Set()
    products.value.forEach(product => {
      product.tags?.forEach(tag => {
        const tagText = tag.text?.toLowerCase()
        if (['personaje', 'skin', 'avatar', 'moneda', 'objeto', 'dlc', 'pack'].includes(tagText)) {
          types.add(tagText)
        }
      })
    })
    return Array.from(types).sort()
  })

  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
      sortBy: 'default',
      showOffers: 'all',
      rarity: 'all',
      type: 'all',
      searchTerm: ''
    }
  }

  return {
    filters,
    filteredAndSortedProducts,
    availableTypes,
    updateFilters,
    resetFilters
  }
}