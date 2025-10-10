<template>
  <div class="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-400 transition group">
    <div class="relative">
      <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover">
      <div v-if="product.discount" class="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
        -{{ product.discount }}%
      </div>
      <div v-if="product.badge" class="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded" :class="product.badge.class">
        {{ product.badge.text }}
      </div>
      <button class="absolute top-2 right-2 bg-gray-900/50 hover:bg-red-600 text-white p-2 rounded-full transition">
        <i data-feather="heart"></i>
      </button>
    </div>
    <div class="p-4">
      <div class="flex items-center space-x-2 mb-2">
        <span v-for="tag in product.tags" :key="tag.text" class="text-xs px-2 py-1 rounded text-white" :class="tag.class">
          {{ tag.text }}
        </span>
      </div>
      <h3 class="font-bold text-lg mb-1 group-hover:text-cyan-300 transition">{{ product.name }}</h3>
      <p v-if="product.description" class="text-gray-400 text-sm mb-3">{{ product.description }}</p>
      <div class="flex items-center justify-between">
        <div v-if="product.originalPrice">
          <span class="text-gray-400 line-through text-sm">${{ product.originalPrice }} MXN</span>
          <p class="text-xl font-bold text-cyan-300">${{ product.price }} MXN</p>
        </div>
        <div v-else>
          <p class="text-xl font-bold text-cyan-300">${{ product.price }} MXN</p>
        </div>
        <button class="btn-unsc px-4 py-2 rounded-lg flex items-center" @click="addToCart">
          <i data-feather="shopping-cart" class="mr-2 w-4"></i>Añadir
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'

export default {
  name: 'CallOfDutyProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const addToCart = () => {
      emit('add-to-cart', props.product)
    }

    onMounted(() => {
      if (window.feather) {
        window.feather.replace()
      }
    })

    return {
      addToCart
    }
  }
}
</script>

<style scoped>
.btn-unsc {
  background: linear-gradient(45deg, #00BFFF, #0080FF);
  border: 1px solid #00BFFF;
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: 0.3s;
}

.btn-unsc:hover {
  background: linear-gradient(45deg, #0080FF, #0066CC);
  box-shadow: 0 0 20px rgba(0, 191, 255, 0.8);
  transform: translateY(-1px);
}
</style>