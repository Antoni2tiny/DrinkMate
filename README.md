## DrinkMate (DrinkGo)

Aplicación Expo React Native para amantes de los tragos: recetas, bares/licorerías cercanas en mapa, favoritos y subida de tragos propios.

### Requisitos
- Node 18+ (recomendado LTS)
- npm 9+ o yarn
- Expo CLI (se instala al ejecutar los scripts)
- Android Studio (para emulador) o dispositivo físico con Expo Go

### Instalación
```bash
npm install
```

### Ejecutar el proyecto
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

### Estructura principal
- `App.tsx`: navegación (stack + bottom tabs)
- `app/screens/`: pantallas Home, Mapa, Favoritos, UploadDrink, RecipeDetail
- `app/auth/Login.tsx`: formulario básico de login (placeholder)
- `utils/`: colores, tamaños y `initFirebase.ts`
- `assets/`: imágenes (coloca aquí `hero-bg.jpg` si usas la imagen del hero)

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
- Home como landing con hero y CTAs (Login, Mapa, Favoritos, Subir)
- Tabs inferiores con iconos: Inicio, Mapa, Favoritos, Subir
- Mapa: geolocalización básica (solicita permiso) y marcador de ubicación actual
- UploadDrink: formulario básico con selector de imagen (galería)

### Agregar imágenes de marca (opcional)
- Hero: `assets/hero-bg.jpg` (coloca tu imagen)

### Variables y estilos
- Paleta en `utils/colors.ts` (`primary`, `accent`, `background`, `surface`, `text`, `muted`)

### Solución de problemas
- Abre primero en Home pero ves Login: cierra la app del emulador, corre `npx expo start -c` y vuelve a iniciar. Si persiste, desinstala la app del emulador.
- Error de versiones con Expo: ejecuta `npx expo install --check` y sigue las recomendaciones.
- Permisos de ubicación no concedidos: habilita permisos en el emulador (Settings → Location) o en el dispositivo.

### Scripts útiles
```bash
npm run start     # Inicia el bundler
npm run android   # Abre Android
npm run ios       # Abre iOS (macOS)
npm run web       # Abre Web
```

### Licencia
MIT


