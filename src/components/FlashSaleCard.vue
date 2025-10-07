<template>
  <div class="glass-card p-6 rounded-xl relative group unsc-hover">
    <div :class="badgeClass" class="absolute top-4 left-4 text-white text-xs px-3 py-1 rounded-full font-bold uppercase">
      {{ sale.type }}
    </div>
    <div class="absolute top-4 right-4 text-red-400 text-sm font-bold">{{ sale.timeLeft }}</div>
    
    <div class="mt-8 mb-4">
      <h4 class="text-xl font-bold text-blue-100 mb-2 uppercase">{{ sale.title }}</h4>
      <p class="text-blue-300 text-sm mb-4">{{ sale.description }}</p>
      
      <div class="flex items-center justify-between mb-4">
        <div>
          <span class="text-gray-400 line-through text-lg">${{ sale.originalPrice }} MXN</span>
          <span class="text-2xl font-bold text-unsc ml-4">${{ sale.price }} MXN</span>
        </div>
        <div class="text-green-400 text-sm font-bold">-{{ sale.discount }}%</div>
      </div>
      
      <button 
        :class="buttonClass"
        class="text-white px-6 py-2 rounded-lg transition w-full font-bold uppercase"
        @click="$emit('purchase', sale)"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'FlashSaleCard',
  props: {
    sale: {
      type: Object,
      required: true
    }
  },
  emits: ['purchase'],
  setup(props) {
    const badgeClass = computed(() => {
      switch (props.sale.type) {
        case 'FLASH SALE':
          return 'bg-red-600 animate-bounce'
        case 'ÚLTIMA OPORTUNIDAD':
          return 'bg-purple-600'
        case 'RECOMPENSA DIARIA':
          return 'bg-yellow-600'
        default:
          return 'bg-blue-600'
      }
    })

    const buttonClass = computed(() => {
      switch (props.sale.type) {
        case 'FLASH SALE':
          return 'bg-red-600 hover:bg-red-700'
        case 'ÚLTIMA OPORTUNIDAD':
          return 'bg-purple-600 hover:bg-purple-700'
        case 'RECOMPENSA DIARIA':
          return 'bg-yellow-600 hover:bg-yellow-700'
        default:
          return 'bg-blue-600 hover:bg-blue-700'
      }
    })

    const buttonText = computed(() => {
      switch (props.sale.type) {
        case 'FLASH SALE':
          return 'COMPRAR YA'
        case 'ÚLTIMA OPORTUNIDAD':
          return 'APROVECHAR OFERTA'
        case 'RECOMPENSA DIARIA':
          return 'RECLAMAR GRATIS'
        default:
          return 'COMPRAR'
      }
    })

    return {
      badgeClass,
      buttonClass,
      buttonText
    }
  }
}
</script>