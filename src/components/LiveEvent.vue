<template>
  <div class="flex items-center gap-6 p-6 glass-card rounded-lg">
    <div class="w-16 h-16 glass-card flex items-center justify-center">
      <i :data-feather="event.icon || 'calendar'" class="text-unsc w-8 h-8"></i>
    </div>
    <div class="flex-1">
      <h4 class="text-lg font-bold text-blue-100 mb-2 uppercase">{{ event.title }}</h4>
      <p class="text-blue-300 text-sm mb-2">{{ event.description }}</p>
      <div class="flex items-center gap-4">
        <span class="text-xs text-gray-400 uppercase">{{ event.status }}</span>
        <span v-if="event.participants" class="text-xs text-blue-300 uppercase">{{ event.participants }}</span>
      </div>
    </div>
    <button 
      class="btn-unsc px-4 py-2 rounded-lg text-sm"
      @click="$emit('participate', event)"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'

export default {
  name: 'LiveEvent',
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  emits: ['participate'],
  setup(props) {
    const buttonText = computed(() => {
      if (props.event.title.includes('TORNEO')) {
        return 'PARTICIPAR'
      } else if (props.event.title.includes('EVENTO')) {
        return 'VER OFERTAS'
      } else {
        return 'UNIRSE'
      }
    })

    onMounted(() => {
      if (window.feather) {
        window.feather.replace()
      }
    })

    return {
      buttonText
    }
  }
}
</script>