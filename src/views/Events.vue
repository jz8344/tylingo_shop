<template>
  <div class="events-container">
    <!-- Background stars -->
    <div id="stars"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>

    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="events-header">
        <h1 class="events-title">
          <i data-feather="map-pin"></i>
          TORNEOS Y EVENTOS
        </h1>
        <p class="events-subtitle">
          Encuentra torneos de gaming cerca de ti y compite por premios épicos
        </p>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <div class="filters-wrapper">
          <button
            v-for="game in gameFilters"
            :key="game.id"
            @click="selectedGame = game.id"
            :class="['filter-btn', { 'active': selectedGame === game.id }]"
            :style="{ '--game-color': game.color }"
          >
            <i :data-feather="game.icon"></i>
            <span>{{ game.name }}</span>
          </button>
        </div>
      </div>

      <!-- Mapa -->
      <div class="map-section">
        <MapboxMap
          :tournaments="filteredTournaments"
          :selected-game="selectedGame"
          @tournament-selected="handleTournamentSelected"
        />
      </div>

      <!-- Lista de torneos -->
      <div class="tournaments-grid">
        <div
          v-for="tournament in filteredTournaments"
          :key="tournament.id"
          class="tournament-card"
          :class="tournament.game.toLowerCase().replace(/\s+/g, '-')"
          @click="focusTournament(tournament)"
        >
          <div class="card-header">
            <div class="card-game-badge" :style="{ background: getGameColor(tournament.game) }">
              {{ tournament.game }}
            </div>
            <div class="card-status">
              <span class="status-dot"></span>
              {{ tournament.status }}
            </div>
          </div>

          <h3 class="card-title">{{ tournament.name }}</h3>

          <div class="card-details">
            <div class="detail-row">
              <i data-feather="calendar"></i>
              <span>{{ tournament.date }}</span>
            </div>
            <div class="detail-row">
              <i data-feather="clock"></i>
              <span>{{ tournament.time }}</span>
            </div>
            <div class="detail-row">
              <i data-feather="map-pin"></i>
              <span>{{ tournament.venue }}</span>
            </div>
            <div class="detail-row">
              <i data-feather="users"></i>
              <span>{{ tournament.participants }} / {{ tournament.maxParticipants }} jugadores</span>
            </div>
          </div>

          <div class="card-prize">
            <i data-feather="award"></i>
            <span class="prize-amount">${{ tournament.prize.toLocaleString() }} MXN</span>
          </div>

          <div class="card-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: (tournament.participants / tournament.maxParticipants * 100) + '%' }"
              ></div>
            </div>
            <span class="progress-text">
              {{ Math.round(tournament.participants / tournament.maxParticipants * 100) }}% lleno
            </span>
          </div>

          <button class="card-register-btn">
            <i data-feather="check-circle"></i>
            Registrarse
          </button>
        </div>
      </div>

      <!-- Modal de detalles (opcional) -->
      <div v-if="selectedTournament" class="tournament-modal" @click="selectedTournament = null">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="selectedTournament = null">
            <i data-feather="x"></i>
          </button>

          <div class="modal-header">
            <h2>{{ selectedTournament.name }}</h2>
            <div class="modal-game-badge" :style="{ background: getGameColor(selectedTournament.game) }">
              {{ selectedTournament.game }}
            </div>
          </div>

          <div class="modal-body">
            <div class="modal-section">
              <h3>Detalles del Evento</h3>
              <div class="modal-details">
                <div class="modal-detail-item">
                  <i data-feather="calendar"></i>
                  <div>
                    <strong>Fecha</strong>
                    <span>{{ selectedTournament.date }}</span>
                  </div>
                </div>
                <div class="modal-detail-item">
                  <i data-feather="clock"></i>
                  <div>
                    <strong>Hora</strong>
                    <span>{{ selectedTournament.time }}</span>
                  </div>
                </div>
                <div class="modal-detail-item">
                  <i data-feather="map-pin"></i>
                  <div>
                    <strong>Ubicación</strong>
                    <span>{{ selectedTournament.venue }}</span>
                  </div>
                </div>
                <div class="modal-detail-item">
                  <i data-feather="award"></i>
                  <div>
                    <strong>Premio</strong>
                    <span>${{ selectedTournament.prize.toLocaleString() }} MXN</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-section">
              <h3>Descripción</h3>
              <p>{{ selectedTournament.description }}</p>
            </div>

            <div class="modal-section">
              <h3>Reglas</h3>
              <ul class="modal-rules">
                <li v-for="(rule, index) in selectedTournament.rules" :key="index">
                  {{ rule }}
                </li>
              </ul>
            </div>
          </div>

          <div class="modal-footer">
            <button class="modal-register-btn">
              <i data-feather="check-circle"></i>
              Registrarse al Torneo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MapboxMap from '@/components/MapboxMap.vue'

const selectedGame = ref('all')
const selectedTournament = ref(null)

const gameFilters = [
  { id: 'all', name: 'Todos', icon: 'grid', color: '#06b6d4' },
  { id: 'fortnite', name: 'Fortnite', icon: 'target', color: '#6366f1' },
  { id: 'call of duty', name: 'Call of Duty', icon: 'crosshair', color: '#ef4444' },
  { id: 'valorant', name: 'Valorant', icon: 'zap', color: '#ec4899' },
  { id: 'apex legends', name: 'Apex Legends', icon: 'activity', color: '#10b981' }
]

// Generar torneos aleatorios en CDMX y alrededores
const tournaments = ref(generateRandomTournaments())

function generateRandomTournaments() {
  const games = ['Fortnite', 'Call of Duty', 'Valorant', 'Apex Legends']
  const venues = [
    'Arena Gaming GDL',
    'Cyber Café Guadalajara',
    'GameZone Tlajomulco',
    'E-Sports Stadium GDL',
    'LAN House Zapopan',
    'Gaming Paradise GDL',
    'Cyber Arena Jalisco',
    'Pro Gamers Hub GDL',
    'Gaming Center Tlajomulco',
    'Arena E-Sports Zapopan'
  ]
  const statuses = ['Inscripciones Abiertas', 'Últimos Lugares', 'Próximamente']

  const tournamentTemplates = [
    'Torneo ${game} - Temporada ${season}',
    'Copa ${game} ${year}',
    'Championship ${game}',
    '${game} Battle Royale',
    'Liga ${game} Pro',
    'Desafío ${game}',
    '${game} Masters',
    'Gran Premio ${game}'
  ]

  const rules = [
    'Registro obligatorio 30 minutos antes',
    'Equipamiento propio o disponible en el venue',
    'Modalidad: Battle Royale / Team Deathmatch',
    'Categorías: Amateur, Semi-Pro y Pro',
    'Fair play obligatorio',
    'Se permiten streamers',
    'Premios en efectivo y productos'
  ]

  const descriptions = [
    'Únete al torneo más emocionante de la temporada y demuestra tus habilidades contra los mejores jugadores de Guadalajara.',
    'Compite en equipos o en solitario por premios increíbles y la gloria de ser el campeón de Jalisco.',
    'Evento organizado por profesionales con árbitros certificados y streaming en vivo desde Tlajomulco.',
    'Formato competitivo con brackets eliminatorios y finales épicas en la zona metropolitana de Guadalajara. ¡No te lo pierdas!'
  ]

  const tournamentsList = []

  // Guadalajara/Tlajomulco de Zúñiga center
  const centerLat = 20.6597 // Guadalajara
  const centerLng = -103.3496

  for (let i = 0; i < 15; i++) {
    const game = games[Math.floor(Math.random() * games.length)]
    const venue = venues[Math.floor(Math.random() * venues.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const template = tournamentTemplates[Math.floor(Math.random() * tournamentTemplates.length)]
    const season = Math.floor(Math.random() * 4) + 1
    const year = 2025

    // Generar ubicación aleatoria en Guadalajara y Tlajomulco
    // Área ampliada para cubrir Guadalajara, Zapopan y Tlajomulco
    const lat = centerLat + (Math.random() - 0.5) * 0.25
    const lng = centerLng + (Math.random() - 0.5) * 0.35

    // Generar fecha aleatoria en los próximos 30 días
    const daysFromNow = Math.floor(Math.random() * 30) + 1
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    const dateStr = date.toLocaleDateString('es-MX', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })

    const hour = Math.floor(Math.random() * 8) + 10 // 10am - 6pm
    const time = `${hour}:00 hrs`

    const participants = Math.floor(Math.random() * 80) + 20
    const maxParticipants = Math.ceil(participants / (Math.random() * 0.5 + 0.5))

    tournamentsList.push({
      id: i + 1,
      name: template.replace('${game}', game).replace('${season}', season).replace('${year}', year),
      game,
      venue,
      status,
      date: dateStr,
      time,
      lat,
      lng,
      participants,
      maxParticipants,
      prize: (Math.floor(Math.random() * 20) + 5) * 1000, // 5k - 25k
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      rules: [
        ...rules.slice(0, Math.floor(Math.random() * 3) + 3)
      ]
    })
  }

  return tournamentsList
}

const filteredTournaments = computed(() => {
  if (selectedGame.value === 'all') {
    return tournaments.value
  }
  return tournaments.value.filter(
    t => t.game.toLowerCase() === selectedGame.value.toLowerCase()
  )
})

function getGameColor(game) {
  const gameMap = {
    'Fortnite': 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'Call of Duty': 'linear-gradient(135deg, #ef4444, #f97316)',
    'Valorant': 'linear-gradient(135deg, #ec4899, #f43f5e)',
    'Apex Legends': 'linear-gradient(135deg, #10b981, #06b6d4)'
  }
  return gameMap[game] || 'linear-gradient(135deg, #06b6d4, #0891b2)'
}

function handleTournamentSelected(tournament) {
  selectedTournament.value = tournament
}

function focusTournament(tournament) {
  selectedTournament.value = tournament
}

onMounted(() => {
  createStarField()

  // Inicializar iconos de Feather
  if (window.feather) {
    window.feather.replace()
  }

  // Listener para evento de registro desde popup
  window.addEventListener('register-tournament', (event) => {
    const tournamentId = event.detail
    const tournament = tournaments.value.find(t => t.id === tournamentId)
    if (tournament) {
      handleTournamentSelected(tournament)
    }
  })
})

function createStarField() {
  function createStar(layer, opts = {}) {
    const s = document.createElement('div')
    s.className = 'star'
    if (opts.variant) s.classList.add(opts.variant)
    s.style.setProperty('--size', (opts.size || (Math.random() * 2 + 1)) + 'px')
    s.style.setProperty('--opacity', (opts.opacity || (Math.random() * 0.6 + 0.4)))
    s.style.setProperty('--twinkle', (opts.twinkle || (Math.random() * 4 + 2)) + 's')
    s.style.left = (Math.random() * 100) + '%'
    s.style.top = (Math.random() * 100) + '%'
    return s
  }

  function populate(layer, count, variantChance) {
    const frag = document.createDocumentFragment()
    for (let i = 0; i < count; i++) {
      const variant = Math.random() < variantChance ? (Math.random() < 0.7 ? 'cold' : 'warm') : null
      frag.appendChild(createStar(layer, { variant }))
    }
    layer.appendChild(frag)
  }

  const layers = [
    document.getElementById('stars'),
    document.getElementById('stars2'),
    document.getElementById('stars3')
  ]

  const density = Math.max(1, Math.min(2.2, (window.innerWidth * window.innerHeight) / (1280 * 720)))
  const counts = [120, 80, 40].map(n => Math.round(n * density))

  if (layers[0]) populate(layers[0], counts[0], 0.2)
  if (layers[1]) populate(layers[1], counts[1], 0.3)
  if (layers[2]) populate(layers[2], counts[2], 0.4)
}
</script>

<style scoped>
.events-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  position: relative;
  overflow-x: hidden;
}

/* Stars background */
#stars, #stars2, #stars3 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.star {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: white;
  border-radius: 50%;
  opacity: var(--opacity);
  animation: twinkle var(--twinkle) ease-in-out infinite;
}

.star.cold {
  background: #a5f3fc;
  box-shadow: 0 0 2px #a5f3fc;
}

.star.warm {
  background: #fde68a;
  box-shadow: 0 0 2px #fde68a;
}

@keyframes twinkle {
  0%, 100% { opacity: var(--opacity); }
  50% { opacity: calc(var(--opacity) * 0.3); }
}

/* Container */
.container {
  position: relative;
  z-index: 1;
}

/* Header */
.events-header {
  text-align: center;
  margin-bottom: 48px;
  padding-top: 32px;
}

.events-title {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-shadow: 0 0 30px rgba(6, 182, 212, 0.5);
}

.events-title i {
  width: 48px;
  height: 48px;
  color: #06b6d4;
  filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.8));
}

.events-subtitle {
  font-size: 1.25rem;
  color: #cbd5e1;
  max-width: 600px;
  margin: 0 auto;
}

/* Filters */
.filters-section {
  margin-bottom: 40px;
}

.filters-wrapper {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  padding: 12px 24px;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(6, 182, 212, 0.2);
  border-radius: 12px;
  color: #cbd5e1;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-btn i {
  width: 20px;
  height: 20px;
}

.filter-btn:hover {
  background: rgba(6, 182, 212, 0.1);
  border-color: var(--game-color);
  color: var(--game-color);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(6, 182, 212, 0.3);
}

.filter-btn.active {
  background: var(--game-color);
  border-color: var(--game-color);
  color: white;
  box-shadow: 0 8px 25px rgba(6, 182, 212, 0.5);
}

/* Map section */
.map-section {
  margin-bottom: 60px;
}

/* Tournaments grid */
.tournaments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
}

.tournament-card {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(6, 182, 212, 0.2);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tournament-card:hover {
  transform: translateY(-8px);
  border-color: #06b6d4;
  box-shadow: 0 20px 60px rgba(6, 182, 212, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-game-badge {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: white;
}

.card-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #06b6d4;
  margin-bottom: 16px;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #cbd5e1;
  font-size: 14px;
}

.detail-row i {
  width: 16px;
  height: 16px;
  color: #06b6d4;
}

.card-prize {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 8px;
  margin-bottom: 16px;
}

.card-prize i {
  width: 24px;
  height: 24px;
  color: #fbbf24;
}

.prize-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fbbf24;
}

.card-progress {
  margin-bottom: 16px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(148, 163, 184, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #06b6d4, #8b5cf6);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #94a3b8;
}

.card-register-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.card-register-btn i {
  width: 20px;
  height: 20px;
}

.card-register-btn:hover {
  background: linear-gradient(135deg, #0891b2, #0e7490);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(6, 182, 212, 0.5);
}

/* Modal */
.tournament-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: 2px solid rgba(6, 182, 212, 0.3);
  border-radius: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(239, 68, 68, 0.2);
  border: 2px solid #ef4444;
  border-radius: 50%;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-close:hover {
  background: #ef4444;
  color: white;
  transform: rotate(90deg);
}

.modal-header {
  padding: 32px 32px 24px;
  border-bottom: 1px solid rgba(6, 182, 212, 0.2);
}

.modal-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #06b6d4;
  margin-bottom: 12px;
  padding-right: 40px;
}

.modal-game-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: white;
}

.modal-body {
  padding: 32px;
}

.modal-section {
  margin-bottom: 32px;
}

.modal-section:last-child {
  margin-bottom: 0;
}

.modal-section h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.modal-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.modal-detail-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(6, 182, 212, 0.05);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 12px;
}

.modal-detail-item i {
  width: 24px;
  height: 24px;
  color: #06b6d4;
  flex-shrink: 0;
}

.modal-detail-item div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-detail-item strong {
  color: #cbd5e1;
  font-size: 14px;
}

.modal-detail-item span {
  color: #94a3b8;
  font-size: 14px;
}

.modal-section p {
  color: #cbd5e1;
  line-height: 1.6;
}

.modal-rules {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-rules li {
  color: #cbd5e1;
  padding-left: 24px;
  position: relative;
}

.modal-rules li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: 700;
}

.modal-footer {
  padding: 24px 32px;
  border-top: 1px solid rgba(6, 182, 212, 0.2);
}

.modal-register-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.modal-register-btn i {
  width: 24px;
  height: 24px;
}

.modal-register-btn:hover {
  background: linear-gradient(135deg, #0891b2, #0e7490);
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(6, 182, 212, 0.6);
}

/* Responsive */
@media (max-width: 768px) {
  .events-title {
    font-size: 2rem;
  }

  .events-title i {
    width: 32px;
    height: 32px;
  }

  .events-subtitle {
    font-size: 1rem;
  }

  .tournaments-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    max-height: 95vh;
  }

  .modal-header h2 {
    font-size: 1.5rem;
  }

  .modal-details {
    grid-template-columns: 1fr;
  }
}
</style>
