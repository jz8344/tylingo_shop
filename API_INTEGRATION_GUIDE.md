# API Integration - Tylingo Shop

## 📚 Documentación Completa

Esta guía explica cómo conectar el frontend Vue 3 con el backend Laravel usando `async/await`.

---

## 🏗️ Estructura del Proyecto

### Backend Laravel (API REST)

```
backend/
├── app/Http/Controllers/
│   ├── ProductoController.php      # Controlador general de productos
│   ├── PersonajeController.php     # Personajes
│   ├── SkinController.php          # Skins
│   ├── MonedaController.php        # Monedas
│   └── AvatarController.php        # Avatares
├── routes/
│   └── api.php                     # Rutas API
└── config/
    └── cors.php                    # Configuración CORS
```

### Frontend Vue 3

```
tylingo_shop/
├── .env                           # Variables de entorno
└── src/
    ├── services/
    │   ├── api.js                 # Servicio base HTTP
    │   ├── productService.js      # Servicio de productos
    │   ├── personajeService.js    # Servicio de personajes
    │   ├── skinService.js         # Servicio de skins
    │   ├── monedaService.js       # Servicio de monedas
    │   └── avatarService.js       # Servicio de avatares
    └── views/
        └── Home.vue               # Vista principal
```

---

## 🚀 Configuración Inicial

### 1. Backend Laravel

#### Iniciar el servidor
```bash
cd backend
php artisan serve
```

El servidor estará disponible en: `http://localhost:8000`

#### Verificar rutas API
```bash
php artisan route:list --name=api
```

### 2. Frontend Vue

#### Instalar dependencias (si es necesario)
```bash
cd tylingo_shop
npm install
```

#### Configurar variables de entorno
Archivo `.env` ya creado con:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

#### Iniciar el servidor de desarrollo
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 📡 API Endpoints Disponibles

### Productos Generales

| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| GET | `/api/v1/productos` | Obtener todos los productos | `?videojuego=fortnite&categoria=skins&ofertas=true&search=goku` |
| GET | `/api/v1/productos/juego/{juego}` | Productos por juego | - |
| GET | `/api/v1/productos/destacados` | Productos destacados | - |
| GET | `/api/v1/productos/ofertas-diarias` | Ofertas del día | - |
| GET | `/api/v1/productos/buscar` | Búsqueda de productos | `?q=termino` |

### Personajes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/personajes` | Listar todos los personajes |
| GET | `/api/v1/personajes/{id}` | Obtener un personaje |

### Skins

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/skins` | Listar todas las skins |
| GET | `/api/v1/skins/{id}` | Obtener una skin |

### Monedas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/monedas` | Listar todas las monedas |
| GET | `/api/v1/monedas/{id}` | Obtener una moneda |

### Avatares

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/avatares` | Listar todos los avatares |
| GET | `/api/v1/avatares/{id}` | Obtener un avatar |

---

## 💻 Uso en Vue Components

### Ejemplo Básico

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { getDailyDeals } from '@/services/productService'

const productos = ref([])
const loading = ref(false)
const error = ref(null)

async function cargarProductos() {
  try {
    loading.value = true
    productos.value = await getDailyDeals()
  } catch (err) {
    error.value = 'Error al cargar productos'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarProductos()
})
</script>

<template>
  <div v-if="loading">Cargando...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <ProductCard 
      v-for="producto in productos" 
      :key="producto.id"
      :product="producto"
    />
  </div>
</template>
```

### Búsqueda de Productos

```javascript
import { searchProducts } from '@/services/productService'

async function buscar(termino) {
  try {
    const resultados = await searchProducts(termino)
    console.log('Encontrados:', resultados)
    return resultados
  } catch (error) {
    console.error('Error en búsqueda:', error)
  }
}
```

### Filtrar por Juego

```javascript
import { getProductsByGame } from '@/services/productService'

async function cargarFortnite() {
  const productos = await getProductsByGame('fortnite')
  return productos
}

async function cargarCallOfDuty() {
  const productos = await getProductsByGame('call of duty')
  return productos
}
```

### Filtros Múltiples

```javascript
import { getAllProducts } from '@/services/productService'

// Solo ofertas
const ofertas = await getAllProducts({ ofertas: 'true' })

// Por videojuego
const fortnite = await getAllProducts({ videojuego: 'fortnite' })

// Por categoría
const skins = await getAllProducts({ categoria: 'skins' })

// Combinado
const ofertasFortnite = await getAllProducts({ 
  videojuego: 'fortnite', 
  ofertas: 'true' 
})
```

---

## 🔧 Servicios Disponibles

### productService.js

```javascript
import { getDailyDeals, getFeaturedProducts, getProductsByGame, searchProducts, getAllProducts } from '@/services/productService'

// Ofertas diarias
const ofertas = await getDailyDeals()

// Destacados
const destacados = await getFeaturedProducts()

// Por juego
const cod = await getProductsByGame('call of duty')

// Búsqueda
const resultados = await searchProducts('goku')

// Todos con filtros
const filtered = await getAllProducts({ 
  videojuego: 'fortnite',
  categoria: 'personajes',
  ofertas: 'true'
})
```

### personajeService.js

```javascript
import { getAllPersonajes, getPersonajeById } from '@/services/personajeService'

// Todos los personajes
const personajes = await getAllPersonajes()

// Un personaje específico
const personaje = await getPersonajeById(1)
```

### skinService.js

```javascript
import { getAllSkins, getSkinById } from '@/services/skinService'

// Todas las skins
const skins = await getAllSkins()

// Una skin específica
const skin = await getSkinById(5)
```

---

## 🎯 Ejemplo Completo - Home.vue

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDailyDeals, getProductsByGame } from '@/services/productService'
import ProductCard from '@/components/ProductCard.vue'

const router = useRouter()
const dailyProducts = ref([])
const codProducts = ref([])
const loading = ref(false)

async function loadData() {
  try {
    loading.value = true
    
    // Cargar ofertas diarias
    const deals = await getDailyDeals()
    dailyProducts.value = deals
    
    // Cargar productos Call of Duty
    const cod = await getProductsByGame('call of duty')
    codProducts.value = cod.slice(0, 3)
    
  } catch (error) {
    console.error('Error cargando datos:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const addToCart = (product) => {
  console.log('Agregar al carrito:', product)
}
</script>

<template>
  <div class="home-view">
    <section class="py-16 container mx-auto px-4">
      <h2 class="text-4xl font-bold mb-8">OFERTAS DIARIAS</h2>
      
      <div v-if="loading" class="text-center py-8">
        <p>Cargando productos...</p>
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <ProductCard
          v-for="product in dailyProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>
    </section>
  </div>
</template>
```

---

## 🛠️ Troubleshooting

### Error de CORS

Si ves errores de CORS en la consola:

1. Verifica que el backend esté corriendo en `http://localhost:8000`
2. Verifica que `config/cors.php` incluya `http://localhost:5173`
3. Reinicia el servidor Laravel

### Error 404 en las rutas

1. Verifica que las rutas estén en `routes/api.php`
2. Ejecuta: `php artisan route:clear`
3. Verifica la URL base en `.env`: `VITE_API_URL=http://localhost:8000/api/v1`

### Productos no se cargan

1. Abre la consola del navegador (F12)
2. Ve a la pestaña Network
3. Busca la petición a `/api/v1/productos`
4. Verifica el código de respuesta y el contenido

### Datos vacíos

1. Verifica que tengas datos en la base de datos
2. Ejecuta seeders si es necesario: `php artisan db:seed`
3. Verifica los modelos en `app/Models/`

---

## 📝 Notas Importantes

1. **CORS está configurado** para aceptar peticiones desde `localhost:5173`
2. **Todas las rutas API** usan el prefijo `/api/v1`
3. **Los servicios usan fetch nativo**, no necesitas instalar axios
4. **Manejo de errores** incluido en todos los servicios
5. **TypeScript ready** - puedes agregar tipos si lo necesitas

---

## 🎨 Estructura de Respuesta API

Todos los endpoints retornan JSON con esta estructura:

```json
[
  {
    "id": 1,
    "nombre": "Goku Black",
    "descripcion": "Skin exclusiva Dragon Ball Super",
    "precio": 394,
    "precio_oferta": 250,
    "es_oferta": true,
    "rareza": "legendario",
    "categoria": "personajes",
    "videojuego": "fortnite",
    "imagen_path": "/storage/productos/goku.png",
    "etiqueta": "NUEVO",
    "fecha_publicacion": "2025-10-09T00:00:00.000000Z",
    "tipo_producto": "personaje"
  }
]
```

---

## ✅ Checklist de Integración

- [x] Backend Laravel funcionando en puerto 8000
- [x] CORS configurado correctamente
- [x] Rutas API definidas en `routes/api.php`
- [x] Controladores con métodos `apiIndex()` y `apiShow()`
- [x] Archivo `.env` en Vue con `VITE_API_URL`
- [x] Servicios creados en `src/services/`
- [x] Ejemplos de uso documentados
- [ ] Actualizar Home.vue para usar API real
- [ ] Actualizar otros componentes (Fortnite.vue, CallOfDuty.vue, etc.)
- [ ] Agregar manejo de estados de carga
- [ ] Agregar manejo de errores en UI

---

## 🚀 Próximos Pasos

1. **Actualiza Home.vue** reemplazando los datos estáticos por llamadas a la API
2. **Actualiza Fortnite.vue** para cargar productos de Fortnite
3. **Actualiza CallOfDuty.vue** para cargar productos de COD
4. **Implementa la búsqueda** en Search.vue
5. **Agrega loading spinners** durante las peticiones
6. **Implementa caché** si es necesario para mejorar rendimiento

---

## 📞 Soporte

Si tienes problemas:
1. Verifica la consola del navegador (F12)
2. Verifica los logs de Laravel: `storage/logs/laravel.log`
3. Usa `console.log()` para debuggear
4. Verifica que ambos servidores estén corriendo

---

**¡Listo para usar! 🎮✨**
