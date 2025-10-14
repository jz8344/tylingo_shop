import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { autoInitializeAuth } from '@/stores/auth.js'

// Importar estilos globales
import '@/styles/global.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// 🚀 Auto-inicializar autenticación después de configurar Pinia
autoInitializeAuth()

app.mount('#app')
