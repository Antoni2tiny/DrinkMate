## DrinkMate (DrinkGo)

Aplicación Expo React Native para amantes de los tragos: recetas, bares/licorerías cercanas en mapa, favoritos y subida de tragos propios.

### Requisitos
- Node LTS (recomendado 20.x). Evitar Node 22 por incompatibilidades con algunas herramientas
- npm 9+ o yarn
- Expo CLI (se usa vía `npx expo ...`)
- Android Studio (para emulador) o dispositivo físico con Expo Go
- iOS requiere macOS con Xcode

### Instalación
```bash
npm install
```

Primera vez o tras actualizar Expo SDK:
```bash
npx expo install --check     # sugiere versiones compatibles
```

### Ejecutar el proyecto
- Iniciar bundler (todas las plataformas):
```bash
npm run start
```
- Android (emulador o dispositivo conectado):
```bash
npm run android
```
- iOS (solo macOS con Xcode):
```bash
npm run ios
```
- Web:
```bash
npm run web
```

Si Metro está usando un puerto ocupado, Expo preguntará por uno alternativo. Acepta con "yes".

En Windows PowerShell es conveniente usar `npx expo start -c` para limpiar caché si ves pantalla en blanco.

### Estructura principal
- `App.tsx`: navegación (stack + bottom tabs)
- `index.ts`: registro de la app (Expo)
- `app/screens/`:
  - `Home.tsx` (landing, hero y accesos rápidos)
  - `Recipes.tsx` (lista básica de recetas)
  - `RecipeDetail.tsx`
  - `Map.tsx`
  - `Favorites.tsx`
  - `UploadDrink.tsx`
  - `Trivia.tsx` (juego con categorías y niveles)
  - `WeatherSuggestions.tsx` (sugerencias por clima – en construcción)
- `app/auth/Login.tsx`
- `utils/`: `colors.ts`, `sizes.ts`, `initFirebase.ts`, `index.ts`
- `assets/`: imágenes (ej. `hero-bg.jpg`, `home-bg.jpg`, `trivia.png`)

### Dependencias principales
- Expo SDK 53 (`expo ~53.x`)
- React 19, React Native 0.79 (alineadas con Expo 53)
- React Navigation (`@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`)
- `react-native-safe-area-context`, `react-native-screens`
- Mapa: `react-native-maps`
- Expo APIs: `expo-status-bar`, `expo-location`, `expo-image-picker`, `expo-sharing`

Para asegurar versiones compatibles con tu SDK, usa:
```bash
npx expo install <paquete>
```

### Configurar Firebase (opcional, para auth y Firestore)
1. Crea un proyecto en Firebase Console y habilita Authentication (Email/Password) y Firestore si lo usarás.
2. Copia tus credenciales web en `utils/initFirebase.ts`:
```ts
const config = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

### Funcionalidades actuales
- Home como landing con hero y CTA de Login
- Accesos rápidos: Recetas, Mapa, Favoritos, Subir, Trivia, Clima
- Sección "¿Qué ofrece DrinkGo?" con descripciones de módulos, incluyendo Trivia y Clima
- Trivia: preguntas por categorías, niveles, puntaje, finalizar/reiniciar
- Recetas: listado base y detalle placeholder
- Mapa: geolocalización básica (solicita permiso)
- UploadDrink: formulario simple con selección de imagen

### Agregar imágenes de marca (opcional)
- Hero: `assets/hero-bg.jpg` (coloca tu imagen)

### Variables y estilos
- Paleta en `utils/colors.ts` (`primary`, `accent`, `background`, `surface`, `text`, `muted`)

### Solución de problemas
- Pantalla en blanco/solo splash: `npx expo start -c` (limpia caché) y reinstala la app del emulador si persiste.
- Puerto 8081 ocupado: Expo propondrá otro puerto. Acepta.
- “Cannot find module 'expo'”: usa `npx expo start` (no `npx run expo`).
- Desfase de versiones: `npx expo install --check` y aplica sugerencias.
- Node incompatible: usa Node 20 LTS (`nvm use 20` si usas nvm) y reinstala `node_modules`.
- Permisos de ubicación no concedidos: habilítalos en el emulador (Settings → Location) o en el dispositivo.

### Scripts útiles
```bash
npm run start     # Inicia el bundler
npm run android   # Abre Android
npm run ios       # Abre iOS (macOS)
npm run web       # Abre Web
```

### Capturas (placeholders)
- Home (landing): `docs/screens/home.png`
- Mapa: `docs/screens/map.png`
- Favoritos: `docs/screens/favorites.png`
- Subir trago: `docs/screens/upload.png`

Puedes crear la carpeta `docs/screens/` y colocar tus imágenes con esos nombres para que se muestren en el repo.

### Roadmap
- Autenticación completa con Firebase (registro, login, reset password)
- Integración Firestore: recetas, favoritos, tragos subidos por usuario
- Búsqueda por nombre/ingrediente con filtros de categorías
- Mapa: lugares cercanos con filtros (bar/licorería), ratings y detalles
- Compartir recetas y lugares (WhatsApp/Redes)
- Notificaciones según clima con recomendaciones
- Mejora UI/UX: tema oscuro, animaciones, estados vacíos

### Licencia
MIT


