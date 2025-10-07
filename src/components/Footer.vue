<template>
  <!-- Footer UNSC -->
  <footer class="glass-card border-t border-unsc/30 py-16 mt-20">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 glass-card flex items-center justify-center">
              <i data-feather="zap" class="text-unsc w-6 h-6"></i>
            </div>
            <h3 class="text-xl font-bold unsc-title">Game Shop</h3>
          </div>
          <p class="text-blue-300 mb-4 uppercase tracking-wide">
            Tu destino definitivo para skins, armas y accesorios de Fortnite
          </p>
          <div class="flex space-x-4">
            <a href="#" class="w-10 h-10 glass-card flex items-center justify-center unsc-hover">
              <i data-feather="facebook" class="text-unsc w-5 h-5"></i>
            </a>
            <a href="#" class="w-10 h-10 glass-card flex items-center justify-center unsc-hover">
              <i data-feather="twitter" class="text-unsc w-5 h-5"></i>
            </a>
            <a href="#" class="w-10 h-10 glass-card flex items-center justify-center unsc-hover">
              <i data-feather="instagram" class="text-unsc w-5 h-5"></i>
            </a>
            <a href="#" class="w-10 h-10 glass-card flex items-center justify-center unsc-hover">
              <i data-feather="youtube" class="text-unsc w-5 h-5"></i>
            </a>
          </div>
        </div>
        
        <div>
          <h4 class="font-bold mb-4 text-unsc uppercase tracking-wider">CATÁLOGO</h4>
          <ul class="space-y-3">
            <li><router-link to="/fortnite" class="text-blue-300 hover:text-unsc transition uppercase text-sm">Fortnite Skins</router-link></li>
            <li><router-link to="/fortnite/weapons" class="text-blue-300 hover:text-unsc transition uppercase text-sm">Armas</router-link></li>
            <li><router-link to="/fortnite/accessories" class="text-blue-300 hover:text-unsc transition uppercase text-sm">Accesorios</router-link></li>
            <li><router-link to="/callofduty" class="text-blue-300 hover:text-unsc transition uppercase text-sm">Call of Duty</router-link></li>
            <li><router-link to="/packs" class="text-blue-300 hover:text-unsc transition uppercase text-sm">Packs Especiales</router-link></li>
            <li><router-link to="/offers" class="text-blue-300 hover:text-unsc transition uppercase text-sm">Ofertas</router-link></li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-bold mb-4 text-unsc uppercase tracking-wider">SOPORTE</h4>
          <ul class="space-y-3">
            <li><router-link to="/help" class="text-blue-300 hover:text-unsc transition uppercase text-sm">Centro de Ayuda</router-link></li>
            <li><router-link to="/contact" class="text-blue-300 hover:text-unsc transition uppercase text-sm">Contacto</router-link></li>
            <li><router-link to="/faq" class="text-blue-300 hover:text-unsc transition uppercase text-sm">Preguntas Frecuentes</router-link></li>
            <li><router-link to="/shipping" class="text-blue-300 hover:text-unsc transition uppercase text-sm">Envíos</router-link></li>
            <li><router-link to="/returns" class="text-blue-300 hover:text-unsc transition uppercase text-sm">Devoluciones</router-link></li>
            <li><router-link to="/warranty" class="text-blue-300 hover:text-unsc transition uppercase text-sm">Garantía</router-link></li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-bold mb-4 text-unsc uppercase tracking-wider">TÉRMINOS</h4>
          <ul class="space-y-3">
            <li><router-link to="/terms" class="text-blue-300 hover:text-unsc transition uppercase text-sm">Términos de Uso</router-link></li>
            <li><router-link to="/privacy" class="text-blue-300 hover:text-unsc transition uppercase text-sm">Privacidad</router-link></li>
            <li><router-link to="/cookies" class="text-blue-300 hover:text-unsc transition uppercase text-sm">Cookies</router-link></li>
          </ul>
          <div class="glass-card p-3 mt-4">
            <p class="text-xs text-blue-300 uppercase tracking-wider">
              <i data-feather="shield" class="inline w-3 h-3 mr-1"></i>
              Pagos Seguros
            </p>
          </div>
        </div>
      </div>
      
      <div class="border-t border-unsc/30 mt-12 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center space-x-4 mb-4 md:mb-0">
            <p class="text-blue-300 text-sm uppercase tracking-wider">
              © {{ currentYear }} Game Shop UNSC. Todos los derechos reservados.
            </p>
            <div class="flex items-center space-x-2">
              <i data-feather="lock" class="text-unsc w-4 h-4"></i>
              <span class="text-xs text-blue-300 uppercase">SSL Seguro</span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-xs text-blue-300 uppercase tracking-wider">Métodos de Pago:</span>
            <div class="flex space-x-2">
              <div class="w-8 h-6 glass-card flex items-center justify-center">
                <i data-feather="credit-card" class="text-unsc w-4 h-4"></i>
              </div>
            </div>
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