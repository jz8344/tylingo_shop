# 🎮 Tylingo Shop - Frontend

**E-commerce moderno de productos gaming con tema UNSC/Halo inspirado en diseño futurista.**

---

## 🌟 Características Principales

- ✨ **Diseño UNSC/Halo**: Interfaz futurista con efectos de glass morphism
- 🌌 **Starfield Animado**: Fondo de estrellas animadas en todas las vistas
- 🔄 **Detección Automática de API**: Funciona automáticamente en localhost y red local
- 🛒 **Carrito de Compras**: Sistema completo con Pinia state management
- 🎨 **TailwindCSS**: Estilos utility-first altamente personalizables
- 📱 **Responsive**: Diseño adaptable a todos los dispositivos
- 🚀 **Vue 3 + Composition API**: Framework moderno y reactivo

---

## 📋 Tabla de Contenidos

- [Instalación Rápida](#instalación-rápida)
- [Configuración](#configuración)
- [Scripts Disponibles](#scripts-disponibles)
- [Red Local](#red-local)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación](#documentación)

---

## ⚡ Instalación Rápida

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env según tus necesidades
# Para detección automática, deja VITE_API_URL vacío
```

### 3. Iniciar servidor de desarrollo

```bash
# Solo localhost
npm run dev:local

# Acceso desde red local
npm run dev
# o
npm run dev:network
```

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Backend Laravel URL
# Deja vacío para detección automática (RECOMENDADO)
VITE_API_URL=

# Puerto del backend (solo para detección automática)
VITE_API_PORT=8000

# Nombre de la aplicación
VITE_APP_NAME=Tylingo Shop
```

### Detección Automática de API

El sistema detecta automáticamente la IP desde donde accedes:

- **Localhost**: `http://localhost:8000/api/v1`
- **Red Local**: `http://TU_IP:8000/api/v1`

📚 [Ver documentación completa de detección automática](../API_AUTODETECCION.md)

---

## 🚀 Scripts Disponibles

```bash
# Desarrollo - Solo localhost
npm run dev:local

# Desarrollo - Acceso desde red local
npm run dev
npm run dev:network

# Build de producción
npm run build

# Preview del build
npm run preview
npm run preview:network
```

---

## 🌐 Red Local

### Para acceder desde otros dispositivos:

#### 1. Inicia el backend

```bash
cd ../backend
php artisan serve --host=0.0.0.0 --port=8000
```

#### 2. Inicia el frontend

```bash
npm run dev:network
```

#### 3. Accede desde cualquier dispositivo

```
http://TU_IP:5173
```

Ejemplo: `http://192.168.1.100:5173`

📚 [Ver guía completa de red local](../GUIA_RED_LOCAL.md)

---

## 📁 Estructura del Proyecto

```
tylingo_shop/
├── public/              # Archivos estáticos
│   └── img/            # Imágenes del proyecto
├── src/
│   ├── assets/         # Assets (CSS, imágenes, etc)
│   ├── components/     # Componentes Vue reutilizables
│   │   ├── Navbar.vue
│   │   ├── Footer.vue
│   │   ├── ProductCard.vue
│   │   └── ApiDebugPanel.vue
│   ├── composables/    # Funciones composables de Vue
│   ├── middleware/     # Middlewares de rutas
│   ├── router/         # Configuración de Vue Router
│   ├── services/       # Servicios (API, etc)
│   │   └── api.js      # 🔄 Con detección automática
│   ├── stores/         # Pinia stores (state management)
│   │   └── cart.js
│   ├── styles/         # Estilos globales
│   │   └── global.css  # 🌌 Incluye starfield CSS
│   ├── utils/          # Utilidades y helpers
│   ├── views/          # Vistas/páginas de la aplicación
│   │   ├── Home.vue
│   │   ├── Fortnite.vue
│   │   ├── Cart.vue
│   │   └── ...
│   ├── App.vue         # Componente raíz
│   └── main.js         # Punto de entrada
├── .env                # Variables de entorno
├── .env.example        # Template de configuración
├── package.json        # Dependencias y scripts
├── vite.config.js      # Configuración de Vite
└── tailwind.config.js  # Configuración de Tailwind
```

---

## 🎨 Tecnologías

- **[Vue 3](https://vuejs.org/)** - Framework progresivo de JavaScript
- **[Vite](https://vitejs.dev/)** - Build tool ultrarrápido
- **[Vue Router](https://router.vuejs.org/)** - Enrutamiento oficial de Vue
- **[Pinia](https://pinia.vuejs.org/)** - State management moderno
- **[TailwindCSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Feather Icons](https://feathericons.com/)** - Íconos SVG limpios

---

## 🔧 Herramientas de Desarrollo

### Panel de Debug de API

Presiona **`Ctrl+Shift+D`** para mostrar/ocultar el panel de debug que muestra:

- Host del frontend
- URL de la API detectada
- Estado de la conexión
- Botón de prueba de conexión

### Vue DevTools

Instala la extensión para tu navegador:
- [Chrome/Edge](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

---

## 📚 Documentación Adicional

- 📖 [README Principal del Proyecto](../README.md)
- 🔄 [Detección Automática de API](../API_AUTODETECCION.md)
- 🌐 [Guía de Configuración en Red Local](../GUIA_RED_LOCAL.md)
- 🎨 [Guía de Starfield](../STARFIELD_UPDATE.md)
- ⚡ [Optimizaciones de Rendimiento](../OPTIMIZACIONES_RENDIMIENTO.md)

---

## 🐛 Solución de Problemas

### El starfield no se ve

1. Verifica que los divs `#stars`, `#stars2`, `#stars3` estén en la vista
2. Confirma que `global.css` esté importado en `main.js`
3. Revisa el z-index de los contenedores (debe ser 1)

### Error de conexión con la API

1. Abre el panel de debug: `Ctrl+Shift+D`
2. Verifica la URL de la API detectada
3. Asegúrate de que el backend esté corriendo
4. Revisa la configuración de CORS en Laravel

### El frontend no es accesible desde otros dispositivos

1. Inicia con: `npm run dev:network`
2. Verifica que ambos dispositivos estén en la misma red
3. Revisa el firewall (debe permitir puerto 5173)

---

## 🚀 Compilar para Producción

```bash
# Construir para producción
npm run build

# Preview del build localmente
npm run preview
```

El build se generará en la carpeta `dist/`.

### Variables de Entorno para Producción

```env
VITE_API_URL=https://api.tudominio.com/api/v1
VITE_APP_NAME=Tylingo Shop
```

---

## 📝 Licencia

Este proyecto es privado y pertenece a Tylingo Shop.

---

## 🤝 Contribuir

Si quieres contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 👨‍💻 Desarrollado con ❤️

**Tylingo Shop** - Tu destino de productos gaming

---

## 🆘 Soporte

Si necesitas ayuda:

1. Revisa la [documentación completa](../README.md)
2. Verifica los logs en la consola del navegador (F12)
3. Usa el panel de debug (`Ctrl+Shift+D`)
4. Revisa los issues en GitHub (si aplica)

---

**✨ ¡Disfruta desarrollando con Tylingo Shop!**
````
