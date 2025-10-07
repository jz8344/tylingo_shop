<template>
  <div class="product-card rounded-xl overflow-hidden unsc-hover">
    <div class="relative">
      <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover">
      <div v-if="product.discount" class="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold uppercase">
        -{{ product.discount }}%
      </div>
      <div v-if="product.rarity" class="absolute top-3 right-3 bg-unsc text-black text-xs px-3 py-1 rounded-full font-bold uppercase">
        {{ product.rarity }}
      </div>
      <button 
        class="absolute top-2 right-2 bg-gray-900/50 hover:bg-red-600 text-white p-2 rounded-full transition"
        @click="$emit('toggle-favorite', product)"
      >
        <i data-feather="heart"></i>
      </button>
    </div>
    <div class="p-6 flex flex-col justify-between flex-1">
      <div>
        <div class="flex items-center space-x-2 mb-3">
          <span v-if="product.game" class="text-xs bg-blue-600 px-2 py-1 rounded">{{ product.game }}</span>
          <span v-if="product.rarity" class="text-xs bg-purple-600 px-2 py-1 rounded">{{ product.rarity }}</span>
        </div>
        <h3 class="font-bold text-lg mb-2 text-blue-100 uppercase tracking-wide">{{ product.name }}</h3>
        <p class="text-blue-300 text-sm mb-4 uppercase">{{ product.description }}</p>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <span v-if="product.originalPrice" class="text-gray-400 line-through text-sm">${{ product.originalPrice }} MXN</span>
          <span class="text-xl font-bold text-primary">${{ product.price }} MXN</span>
        </div>
        <button 
          class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition flex items-center"
          @click="$emit('add-to-cart', product)"
        >
          <i data-feather="plus" class="w-4 h-4 mr-1"></i>
          Agregar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'

export default {
  name: 'ProductCard',
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