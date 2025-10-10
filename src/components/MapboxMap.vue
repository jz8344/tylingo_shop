<template>
  <div class="mapbox-container">
    <div ref="mapContainer" class="map-wrapper"></div>
    
    <!-- Controles personalizados -->
    <div class="map-controls">
      <button 
        @click="requestGeolocation" 
        class="control-btn"
        :class="{ 'active': userLocationEnabled }"
        title="Mi ubicación"
      >
        <i data-feather="navigation"></i>
      </button>
      
      <button 
        @click="toggleStyle" 
        class="control-btn"
        title="Cambiar estilo"
      >
        <i data-feather="layers"></i>
      </button>
      
      <button 
        @click="fitBounds" 
        class="control-btn"
        title="Ver todos los torneos"
      >
        <i data-feather="maximize"></i>
      </button>
    </div>

    <!-- Leyenda -->
    <div class="map-legend">
      <div class="legend-item">
        <div class="legend-icon fortnite"></div>
        <span>Fortnite</span>
      </div>
      <div class="legend-item">
        <div class="legend-icon cod"></div>
        <span>Call of Duty</span>
      </div>
      <div class="legend-item">
        <div class="legend-icon valorant"></div>
        <span>Valorant</span>
      </div>
      <div class="legend-item">
        <div class="legend-icon apex"></div>
        <span>Apex Legends</span>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Cargando mapa...</p>
    </div>

    <!-- Token no configurado -->
    <div v-if="!hasValidToken" class="token-warning">
      <div class="warning-icon">
        <i data-feather="alert-triangle"></i>
      </div>
      <h3>Token de Mapbox no configurado</h3>
      <p>Para usar el mapa interactivo necesitas configurar tu token de Mapbox:</p>
      <ol>
        <li>Obtén tu token gratuito en: <a href="https://account.mapbox.com/access-tokens/" target="_blank">account.mapbox.com</a></li>
        <li>Edita el archivo <code>tylingo_shop/.env</code></li>
        <li>Agrega: <code>VITE_MAPBOX_TOKEN=pk.tu_token_aqui</code></li>
        <li>Reinicia el servidor: <code>npm run dev</code></li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const props = defineProps({
  tournaments: {
    type: Array,
    default: () => []
  },
  selectedGame: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['tournament-selected'])

const mapContainer = ref(null)
const map = ref(null)
const userLocationEnabled = ref(false)
const loading = ref(true)
const markers = ref([])
const userMarker = ref(null)
const currentStyleIndex = ref(0)

// Estilos de mapa gamificados
const mapStyles = [
  'mapbox://styles/mapbox/dark-v11',
  'mapbox://styles/mapbox/satellite-streets-v12',
  'mapbox://styles/mapbox/navigation-night-v1',
  'mapbox://styles/mapbox/streets-v12'
]

// Configurar tu API key de Mapbox
const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || ''

// Computed para validar token
const hasValidToken = computed(() => {
  return mapboxToken && mapboxToken !== 'YOUR_MAPBOX_TOKEN_HERE' && mapboxToken.startsWith('pk.')
})

// Validar token antes de usar
if (!hasValidToken.value) {
  console.error('⚠️ Token de Mapbox no configurado correctamente')
  console.log('📝 Para usar el mapa:')
  console.log('1. Obtén tu token en: https://account.mapbox.com/access-tokens/')
  console.log('2. Edita tylingo_shop/.env y agrega: VITE_MAPBOX_TOKEN=pk.tu_token_aqui')
  console.log('3. Reinicia el servidor: npm run dev')
}

mapboxgl.accessToken = mapboxToken

onMounted(() => {
  // Solo inicializar si hay un token válido
  if (hasValidToken.value) {
    initializeMap()
  } else {
    loading.value = false
  }

  // Inicializar iconos de Feather después de que el DOM esté listo
  setTimeout(() => {
    if (window.feather) {
      window.feather.replace()
    }
  }, 100)
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})

watch(() => props.tournaments, () => {
  updateMarkers()
}, { deep: true })

watch(() => props.selectedGame, () => {
  updateMarkers()
})

function initializeMap() {
  // Centro inicial: Guadalajara/Tlajomulco de Zúñiga
  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: mapStyles[currentStyleIndex.value],
    center: [-103.3496, 20.6597], // Guadalajara, Jalisco
    zoom: 11,
    pitch: 45,
    bearing: -17.6,
    antialias: true
  })

  map.value.on('load', () => {
    loading.value = false
    
    // Agregar capa 3D de edificios para efecto gaming
    const layers = map.value.getStyle().layers
    const labelLayerId = layers.find(
      (layer) => layer.type === 'symbol' && layer.layout['text-field']
    )?.id

    map.value.addLayer(
      {
        id: 'add-3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#1e293b',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      },
      labelLayerId
    )

    // Agregar controles de navegación
    map.value.addControl(new mapboxgl.NavigationControl(), 'top-right')
    
    // Agregar marcadores de torneos
    updateMarkers()
    
    // Pedir geolocalización automáticamente
    setTimeout(() => {
      requestGeolocation()
    }, 1000)
  })
}

function requestGeolocation() {
  if (!navigator.geolocation) {
    alert('La geolocalización no está disponible en tu navegador')
    return
  }

  loading.value = true
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { longitude, latitude } = position.coords
      
      // Remover marcador anterior si existe
      if (userMarker.value) {
        userMarker.value.remove()
      }

      // Crear marcador de usuario con estilo personalizado
      const el = document.createElement('div')
      el.className = 'user-location-marker'
      el.innerHTML = `
        <div class="pulse-ring"></div>
        <div class="user-dot"></div>
      `

      userMarker.value = new mapboxgl.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat([longitude, latitude])
        .addTo(map.value)

      // Centrar mapa en ubicación del usuario con animación
      map.value.flyTo({
        center: [longitude, latitude],
        zoom: 13,
        duration: 2000,
        essential: true
      })

      userLocationEnabled.value = true
      loading.value = false
    },
    (error) => {
      console.error('Error obteniendo ubicación:', error)
      alert('No se pudo obtener tu ubicación. Por favor verifica los permisos.')
      loading.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
}

function updateMarkers() {
  // Limpiar marcadores existentes
  markers.value.forEach(marker => marker.remove())
  markers.value = []

  // Filtrar torneos según juego seleccionado
  const filteredTournaments = props.selectedGame === 'all' 
    ? props.tournaments 
    : props.tournaments.filter(t => t.game.toLowerCase() === props.selectedGame.toLowerCase())

  filteredTournaments.forEach(tournament => {
    // Crear elemento HTML personalizado para cada marcador
    const el = document.createElement('div')
    el.className = `tournament-marker ${tournament.game.toLowerCase().replace(/\s+/g, '-')}`
    el.innerHTML = `
      <div class="marker-inner">
        <div class="marker-icon">🎮</div>
        <div class="marker-pulse"></div>
      </div>
    `

    // Crear popup con información del torneo
    const popup = new mapboxgl.Popup({ 
      offset: 25,
      closeButton: true,
      closeOnClick: false,
      className: 'tournament-popup'
    }).setHTML(`
      <div class="popup-content">
        <h3 class="popup-title">${tournament.name}</h3>
        <div class="popup-game">${tournament.game}</div>
        <div class="popup-details">
          <div class="detail-item">
            <i data-feather="calendar"></i>
            <span>${tournament.date}</span>
          </div>
          <div class="detail-item">
            <i data-feather="users"></i>
            <span>${tournament.participants} jugadores</span>
          </div>
          <div class="detail-item">
            <i data-feather="award"></i>
            <span>$${tournament.prize.toLocaleString()} MXN</span>
          </div>
          <div class="detail-item">
            <i data-feather="map-pin"></i>
            <span>${tournament.venue}</span>
          </div>
        </div>
        <button class="popup-register-btn" onclick="window.dispatchEvent(new CustomEvent('register-tournament', { detail: ${tournament.id} }))">
          Registrarse
        </button>
      </div>
    `)

    // Crear y agregar marcador al mapa
    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat([tournament.lng, tournament.lat])
      .setPopup(popup)
      .addTo(map.value)

    // Evento click en marcador
    el.addEventListener('click', () => {
      emit('tournament-selected', tournament)
      
      // Actualizar iconos de Feather en popup después de que se renderice
      setTimeout(() => {
        if (window.feather) {
          window.feather.replace()
        }
      }, 100)
    })

    markers.value.push(marker)
  })

  // Actualizar iconos de Feather
  setTimeout(() => {
    if (window.feather) {
      window.feather.replace()
    }
  }, 100)
}

function toggleStyle() {
  currentStyleIndex.value = (currentStyleIndex.value + 1) % mapStyles.length
  map.value.setStyle(mapStyles[currentStyleIndex.value])
  
  // Re-agregar marcadores después de cambiar estilo
  map.value.once('styledata', () => {
    updateMarkers()
  })
}

function fitBounds() {
  if (props.tournaments.length === 0) return

  const bounds = new mapboxgl.LngLatBounds()

  props.tournaments.forEach(tournament => {
    bounds.extend([tournament.lng, tournament.lat])
  })

  map.value.fitBounds(bounds, {
    padding: { top: 100, bottom: 100, left: 100, right: 100 },
    duration: 2000
  })
}
</script>

<style scoped>
.mapbox-container {
  position: relative;
  width: 100%;
  min-height: 80vh; /* 80% de la altura de la pantalla */
  height: 1200px; /* Altura fija enorme */
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.map-wrapper {
  width: 100%;
  height: 100%;
}

/* Controles personalizados */
.map-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
}

.control-btn {
  width: 48px;
  height: 48px;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(6, 182, 212, 0.3);
  border-radius: 12px;
  color: #06b6d4;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background: rgba(6, 182, 212, 0.2);
  border-color: #06b6d4;
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
}

.control-btn.active {
  background: rgba(6, 182, 212, 0.3);
  border-color: #06b6d4;
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.7);
}

.control-btn i {
  width: 20px;
  height: 20px;
}

/* Leyenda */
.map-legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(6, 182, 212, 0.3);
  border-radius: 12px;
  padding: 16px;
  z-index: 10;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #cbd5e1;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  box-shadow: 0 0 10px currentColor;
}

.legend-icon.fortnite {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.legend-icon.cod {
  background: linear-gradient(135deg, #ef4444, #f97316);
}

.legend-icon.valorant {
  background: linear-gradient(135deg, #ec4899, #f43f5e);
}

.legend-icon.apex {
  background: linear-gradient(135deg, #10b981, #06b6d4);
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(6, 182, 212, 0.2);
  border-top-color: #06b6d4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-overlay p {
  margin-top: 20px;
  color: #06b6d4;
  font-weight: 600;
  font-size: 18px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .mapbox-container {
    height: 400px;
  }

  .map-controls {
    top: 10px;
    left: 10px;
  }

  .control-btn {
    width: 40px;
    height: 40px;
  }

  .map-legend {
    bottom: 10px;
    right: 10px;
    padding: 12px;
    font-size: 12px;
  }

  .legend-icon {
    width: 20px;
    height: 20px;
  }
}
</style>

<style>
/* Estilos globales para marcadores (no scoped) */
.user-location-marker {
  width: 40px;
  height: 40px;
  position: relative;
}

.user-dot {
  width: 16px;
  height: 16px;
  background: #06b6d4;
  border: 3px solid white;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.8);
  z-index: 2;
}

.pulse-ring {
  width: 40px;
  height: 40px;
  border: 3px solid #06b6d4;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  animation: pulse 2s ease-out infinite;
  z-index: 1;
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* Token warning */
.token-warning {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: 2px solid rgba(239, 68, 68, 0.5);
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  z-index: 100;
}

.warning-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.warning-icon i {
  width: 64px;
  height: 64px;
  color: #fbbf24;
  filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.5));
}

.token-warning h3 {
  color: #fbbf24;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
}

.token-warning p {
  color: #cbd5e1;
  margin-bottom: 16px;
  line-height: 1.6;
}

.token-warning ol {
  color: #e2e8f0;
  padding-left: 24px;
  line-height: 1.8;
}

.token-warning li {
  margin-bottom: 8px;
}

.token-warning code {
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: 'Courier New', monospace;
  color: #06b6d4;
  font-size: 0.875rem;
}

.token-warning a {
  color: #06b6d4;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.token-warning a:hover {
  color: #0891b2;
}

/* Marcadores de torneos */
.tournament-marker {
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.tournament-marker:hover {
  transform: scale(1.2);
  z-index: 1000;
}

.marker-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.marker-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.tournament-marker.fortnite .marker-icon {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.tournament-marker.call-of-duty .marker-icon {
  background: linear-gradient(135deg, #ef4444, #f97316);
}

.tournament-marker.valorant .marker-icon {
  background: linear-gradient(135deg, #ec4899, #f43f5e);
}

.tournament-marker.apex-legends .marker-icon {
  background: linear-gradient(135deg, #10b981, #06b6d4);
}

.marker-pulse {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  animation: marker-pulse 2s ease-out infinite;
  z-index: 1;
}

.tournament-marker.fortnite .marker-pulse {
  background: rgba(99, 102, 241, 0.4);
}

.tournament-marker.call-of-duty .marker-pulse {
  background: rgba(239, 68, 68, 0.4);
}

.tournament-marker.valorant .marker-pulse {
  background: rgba(236, 72, 153, 0.4);
}

.tournament-marker.apex-legends .marker-pulse {
  background: rgba(16, 185, 129, 0.4);
}

@keyframes marker-pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* Popup personalizado */
.mapboxgl-popup-content {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
  border: 2px solid rgba(6, 182, 212, 0.3) !important;
  border-radius: 16px !important;
  padding: 0 !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8) !important;
  min-width: 280px;
}

.mapboxgl-popup-tip {
  border-top-color: #0f172a !important;
}

.popup-content {
  padding: 20px;
}

.popup-title {
  color: #06b6d4;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}

.popup-game {
  color: #cbd5e1;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  opacity: 0.8;
}

.popup-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e2e8f0;
  font-size: 14px;
}

.detail-item i {
  width: 16px;
  height: 16px;
  color: #06b6d4;
}

.popup-register-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);
}

.popup-register-btn:hover {
  background: linear-gradient(135deg, #0891b2, #0e7490);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(6, 182, 212, 0.6);
}

/* Responsive */
@media (max-width: 768px) {
  .mapbox-container {
    min-height: 70vh; /* 70% de la altura en móvil */
    height: 600px;
  }

  .map-controls {
    left: 10px;
    top: 10px;
  }

  .control-btn {
    width: 40px;
    height: 40px;
  }

  .map-legend {
    bottom: 10px;
    left: 10px;
    right: 10px;
  }
}
</style>
