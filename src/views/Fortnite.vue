<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-6 unsc-title">FORTNITE</h1>
        <p class="text-xl text-blue-200 max-w-3xl mx-auto">
          Descubre las mejores skins, armas y accesorios de Fortnite
        </p>
      </div>
      
      <div class="glass-card p-8 text-center">
        <i data-feather="gamepad-2" class="w-16 h-16 text-unsc mx-auto mb-4"></i>
        <h2 class="text-2xl font-bold text-blue-100 mb-4">Próximamente</h2>
        <p class="text-blue-300">Esta sección está en construcción. Pronto tendrás acceso a todo el catálogo de Fortnite.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'

export default {
  name: 'Fortnite',
  setup() {
    onMounted(() => {
      if (window.feather) {
        window.feather.replace()
      }
    })
  }
}
</script>