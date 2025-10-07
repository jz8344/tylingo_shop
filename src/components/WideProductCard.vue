<template>
  <div class="glass-card rounded-xl overflow-hidden unsc-hover group">
    <div class="flex flex-col md:flex-row h-full">
      <!-- Imagen del producto -->
      <div class="md:w-1/3 relative">
        <img :src="product.image" :alt="product.name" class="w-full h-48 md:h-full object-cover">
        <div v-if="product.discount" class="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold uppercase">
          -{{ product.discount }}%
        </div>
        <div v-if="product.rarity" class="absolute top-3 right-3 bg-unsc text-black text-xs px-3 py-1 rounded-full font-bold uppercase">
          {{ product.rarity }}
        </div>
      </div>
      
      <!-- Contenido del producto -->
      <div class="md:w-2/3 p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center space-x-2 mb-3">
            <span v-if="product.game" class="text-xs bg-blue-600 px-2 py-1 rounded uppercase">{{ product.game }}</span>
            <span v-if="product.category" class="text-xs bg-purple-600 px-2 py-1 rounded uppercase">{{ product.category }}</span>
          </div>
          
          <h3 class="text-2xl font-bold text-blue-100 mb-3 uppercase tracking-wide">{{ product.name }}</h3>
          <p class="text-blue-300 mb-4 text-base leading-relaxed">{{ product.description }}</p>
          
          <!-- Features si existen -->
          <div v-if="product.features" class="grid grid-cols-2 gap-3 mb-4">
            <div v-for="feature in product.features" :key="feature" class="flex items-center text-sm text-blue-300">
              <i data-feather="check" class="w-4 h-4 mr-2 text-unsc"></i>
              {{ feature }}
            </div>
          </div>
        </div>
        
        <!-- Precio y botón de compra -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div>
              <span v-if="product.originalPrice" class="text-gray-400 line-through text-lg">${{ product.originalPrice }} MXN</span>
              <span class="text-3xl font-bold text-primary ml-2">${{ product.price }} MXN</span>
            </div>
            <div v-if="product.discount" class="bg-green-600 text-white text-sm px-3 py-1 rounded-full font-bold">
              AHORRA {{ product.discount }}%
            </div>
          </div>
          
          <div class="flex gap-3">
            <button 
              class="bg-gray-700 hover:bg-red-600 text-white p-3 rounded-lg transition"
              @click="$emit('toggle-favorite', product)"
              title="Agregar a favoritos"
            >
              <i data-feather="heart" class="w-5 h-5"></i>
            </button>
            <button 
              class="btn-unsc px-6 py-3 rounded-lg text-lg font-bold flex items-center"
              @click="$emit('add-to-cart', product)"
            >
              <i data-feather="shopping-cart" class="w-5 h-5 mr-2"></i>
              AGREGAR AL CARRITO
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'

export default {
  name: 'WideProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  emits: ['add-to-cart', 'toggle-favorite'],
  setup() {
    onMounted(() => {
      if (window.feather) {
        window.feather.replace()
      }
    })
  }
}
</script>