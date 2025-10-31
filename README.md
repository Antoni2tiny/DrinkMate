# DrinkMate 🍹

Una aplicación móvil para descubrir tragos, bares y conectar con la comunidad de bebidas.

## 🚀 Instalación para Colaboradores

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js** (versión 18 o superior)
   - Descargar desde: https://nodejs.org/

2. **Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

3. **Git**
   - Descargar desde: https://git-scm.com/

### Instalación del Proyecto

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Antoni2tiny/DrinkMate.git
   cd DrinkMate
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el proyecto**
   ```bash
   npm start
   ```
   o
   ```bash
   npx expo start
   ```

### 📱 Ejecutar en Dispositivo

#### Opción 1: Expo Go (Recomendado para desarrollo)
1. Instala **Expo Go** en tu dispositivo móvil:
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)

2. Escanea el código QR que aparece en la terminal

#### Opción 2: Simuladores
- **Android**: `npm run android` (requiere Android Studio)
- **iOS**: `npm run ios` (requiere Xcode - solo macOS)
- **Web**: `npm run web`

## 🛠️ Tecnologías Utilizadas

- **React Native** con Expo
- **TypeScript**
- **React Navigation** (navegación)
- **Firebase** (autenticación y base de datos)
- **AsyncStorage** (almacenamiento local)
- **Formik + Yup** (formularios y validación)
- **TheCocktailDB API** (búsqueda de tragos)

## 📁 Estructura del Proyecto

```
DrinkMate/
├── app/
│   ├── components/     # Componentes reutilizables
│   ├── context/        # Contextos de React
│   ├── hooks/          # Hooks personalizados
│   ├── navigation/     # Configuración de navegación
│   ├── screens/        # Pantallas de la aplicación
│   └── auth/          # Pantallas de autenticación
├── assets/            # Imágenes y recursos
├── utils/             # Utilidades y servicios
└── package.json
```

## 🔧 Configuración Adicional

### Firebase (Opcional para desarrollo local)
Si necesitas trabajar con Firebase:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Actualiza la configuración en `utils/initFirebase.ts`
3. Habilita Authentication y Firestore

### Variables de Entorno
El proyecto funciona sin configuración adicional, pero puedes personalizar:
- Configuración de Firebase
- APIs externas

## 🚀 Funcionalidades Principales

- ✅ **Autenticación dual** (usuarios y empresas)
- ✅ **Búsqueda de tragos** con API externa
- ✅ **Navegación protegida** por tipo de usuario
- ✅ **Sistema de notificaciones**
- ✅ **Gestión de favoritos**
- ✅ **Mapa de establecimientos**
- ✅ **Sistema de cupones**

## 🐛 Solución de Problemas Comunes

### Error: "Metro bundler crashed"
```bash
npx expo start --clear
```

### Error: "Unable to resolve module"
```bash
rm -rf node_modules
npm install
```

### Error de permisos en iOS
Asegúrate de tener Xcode actualizado y acepta las licencias:
```bash
sudo xcode-select --install
```

## 📝 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run android` - Ejecuta en Android
- `npm run ios` - Ejecuta en iOS
- `npm run web` - Ejecuta en navegador web

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y está bajo desarrollo.

---

**¿Problemas con la instalación?** Abre un issue en el repositorio o contacta al equipo de desarrollo.