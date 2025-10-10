<template>
  <!-- Footer UNSC -->
  <footer class="glass-card border-t border-unsc/30 py-16 mt-20">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 glass-card flex items-center justify-center unsc-hover">
              <i data-feather="zap" class="text-unsc w-6 h-6"></i>
            </div>
            <h3 class="text-2xl font-bold unsc-title">GAME SHOP</h3>
          </div>
          <p class="text-blue-300 mb-4 uppercase tracking-wide">
            Tu destino definitivo para skins, armas y accesorios de Fortnite
          </p>
          <div class="flex space-x-4">
            <a href="#" class="p-2 glass-card hover:bg-unsc/20 text-blue-200 hover:text-unsc transition rounded-lg">
              <i data-feather="facebook"></i>
            </a>
            <a href="#" class="p-2 glass-card hover:bg-unsc/20 text-blue-200 hover:text-unsc transition rounded-lg">
              <i data-feather="twitter"></i>
            </a>
            <a href="#" class="p-2 glass-card hover:bg-unsc/20 text-blue-200 hover:text-unsc transition rounded-lg">
              <i data-feather="instagram"></i>
            </a>
            <a href="#" class="p-2 glass-card hover:bg-unsc/20 text-blue-200 hover:text-unsc transition rounded-lg">
              <i data-feather="twitch"></i>
            </a>
          </div>
        </div>
        
        <div>
          <h4 class="font-bold mb-4 text-unsc uppercase tracking-wider">CATÁLOGO</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
              <i data-feather="user" class="mr-2 w-4 h-4"></i> SKINS
            </a></li>
            <li><a href="#" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
              <i data-feather="target" class="mr-2 w-4 h-4"></i> ARMAS
            </a></li>
            <li><a href="#" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
              <i data-feather="package" class="mr-2 w-4 h-4"></i> ACCESORIOS
            </a></li>
            <li><a href="#" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
              <i data-feather="music" class="mr-2 w-4 h-4"></i> MÚSICA
            </a></li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-bold mb-4 text-unsc uppercase tracking-wider">SOPORTE</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
              <i data-feather="headphones" class="mr-2 w-4 h-4"></i> CONTACTO
            </a></li>
            <li><a href="#" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
              <i data-feather="help-circle" class="mr-2 w-4 h-4"></i> FAQ
            </a></li>
            <li><a href="#" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
              <i data-feather="truck" class="mr-2 w-4 h-4"></i> ENVÍOS
            </a></li>
            <li><a href="#" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
              <i data-feather="credit-card" class="mr-2 w-4 h-4"></i> PAGOS
            </a></li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-bold mb-4 text-unsc uppercase tracking-wider">TÉRMINOS</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
              <i data-feather="file-text" class="mr-2 w-4 h-4"></i> CONDICIONES
            </a></li>
            <li><a href="#" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
              <i data-feather="shield" class="mr-2 w-4 h-4"></i> PRIVACIDAD
            </a></li>
            <li><a href="#" class="text-blue-200 hover:text-unsc transition uppercase tracking-wide text-sm font-bold flex items-center">
              <i data-feather="alert-circle" class="mr-2 w-4 h-4"></i> AVISO LEGAL
            </a></li>
          </ul>
          <div class="glass-card p-3 mt-4">
            <p class="text-blue-300 text-xs uppercase tracking-wider">⚠️ TIENDA NO OFICIAL</p>
            <p class="text-gray-400 text-xs mt-1">No afiliado con Epic Games o Fortnite</p>
          </div>
        </div>
      </div>
      
      <div class="border-t border-unsc/30 mt-12 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center space-x-4 mb-4 md:mb-0">
            <div class="w-8 h-8 glass-card flex items-center justify-center">
              <i data-feather="zap" class="text-unsc w-4 h-4"></i>
            </div>
            <p class="text-blue-300 text-sm uppercase tracking-wider font-bold">
              © {{ currentYear }} GAME SHOP - AUTORIZADO
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-xs text-gray-400 uppercase tracking-wider">POWERED BY</span>
            <span class="text-unsc text-sm font-bold uppercase tracking-wider">UNSC TECHNOLOGY</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed, onMounted } from 'vue'

export default {
  name: 'Footer',
  setup() {
    const currentYear = computed(() => new Date().getFullYear())

    onMounted(() => {
      // Inicializar iconos de Feather
      if (window.feather) {
        window.feather.replace()
      }
    })

    return {
      currentYear
    }
  }
}
</script>