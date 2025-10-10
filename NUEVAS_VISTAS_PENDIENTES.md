# 🎮 RESUMEN DE VISTAS Y RUTAS A CREAR

## ✅ 1. CallOfDuty.vue - ACTUALIZADO
**Ruta:** `/call-of-duty`
**Archivo:** `tylingo_shop/src/views/CallOfDuty.vue`
**Cambios:** Integración con API usando `getProductsByGame('call of duty')`

## 📝 2. DigitalCoins.vue - NUEVO
**Ruta:** `/digital-coins`
**Archivo:** `tylingo_shop/src/views/DigitalCoins.vue`
**Descripción:** Vista para monedas digitales (COD Points, V-Bucks)
**API:** `getProductsByGame('fortnite')` o `getProductsByGame('call of duty')` filtrado por tipo='moneda'

## 🎨 3. AnimeSkins.vue - NUEVO
**Ruta:** `/anime-skins`
**Archivo:** `tylingo_shop/src/views/AnimeSkins.vue`
**Descripción:** Vista para skins de anime
**API:** Filtrar por categoría='anime' o etiqueta='anime'

## 🏰 4. DisneyInfinity.vue - NUEVO
**Ruta:** `/disney-infinity`
**Archivo:** `tylingo_shop/src/views/DisneyInfinity.vue`
**Descripción:** Vista para productos de Disney Infinity
**API:** `getProductsByGame('disney infinity')`

## 📍 Actualización del Router
**Archivo:** `tylingo_shop/src/router/index.js`

Agregar rutas:
```javascript
{
  path: '/digital-coins',
  name: 'DigitalCoins',
  component: () => import('../views/DigitalCoins.vue')
},
{
  path: '/anime-skins',
  name: 'AnimeSkins',
  component: () => import('../views/AnimeSkins.vue')
},
{
  path: '/disney-infinity',
  name: 'DisneyInfinity',
  component: () => import('../views/DisneyInfinity.vue')
}
```

## 🧭 Actualización del Navbar
**Archivo:** `tylingo_shop/src/components/Navbar.vue`

Agregar links en el menú:
```html
<router-link to="/digital-coins">Monedas Digitales</router-link>
<router-link to="/anime-skins">Anime Skins</router-link>
<router-link to="/disney-infinity">Disney Infinity</router-link>
```

## 🎯 PRÓXIMOS PASOS:

1. Crear archivos Vue para las nuevas vistas
2. Actualizar router con las nuevas rutas
3. Actualizar Navbar con los nuevos links
4. Probar cada vista cargando datos desde la API

## 📊 Estructura de cada vista:
- Loading state (spinner)
- Error state (mensaje + botón reintentar)
- Products grid (cuando hay datos)
- Empty state (cuando no hay productos)
- Fondo estelar animado
- Integración con API usando servicios existentes
