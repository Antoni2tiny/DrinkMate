# DrinkMate - Flujo de Navegación

## 🚀 Nuevo Flujo de Usuario

### 1. **Pantalla de Bienvenida** (`WelcomeHome.tsx`)
- **Ruta inicial**: La app comienza aquí
- **Funcionalidades**:
  - Muestra el logo y características de la app
  - Botón "Iniciar Sesión" → va a Login
  - Botón "Crear Cuenta" → va a Register  
  - Botón "Continuar como invitado" → va a GuestTabs

### 2. **Pantalla de Login** (`Login.tsx`)
- **Funcionalidades mejoradas**:
  - Selector de tipo de usuario: **Usuario** o **Empresa**
  - Formulario de login con validación
  - Botón de regreso a WelcomeHome
  - Link para ir a Register
- **Navegación después del login**:
  - Si es **Usuario** → `UserTabs`
  - Si es **Empresa** → `EmpresaTabs`

### 3. **Navegaciones por Tipo de Usuario**

#### 🏠 **GuestTabs** (Invitados - sin login)
```
├── Explorar (HomeScreen)
├── Recetas (RecipesScreen)  
└── Mapa (MapScreen)
```

#### 👤 **UserTabs** (Usuarios logueados)
```
├── Inicio (HomeUsuario) - Pantalla personal con notificaciones
├── Explorar (HomeScreen)
├── Mapa (MapScreen)
├── Favoritos (FavoritesScreen)
└── Subir (UploadDrinkScreen)
```

#### 🏢 **EmpresaTabs** (Empresas logueadas)
```
├── Panel (EmpresaPanel) - Envío de notificaciones
├── Explorar (HomeScreen)
└── Mapa (MapScreen)
```

## 📱 Pantallas Específicas

### **HomeUsuario.tsx** (Solo usuarios logueados)
- Fondo oscuro con tema personalizado
- Secciones:
  - Perfil del usuario
  - Acciones rápidas (Subir, Mapa, Favoritos)
  - Botón "Probar Notificación Local"
  - Lista de tragos recientes
  - Estado de notificaciones push
- Márgenes adaptativos que no se salen de pantalla

### **EmpresaPanel.tsx** (Solo empresas)
- Panel de control empresarial
- Formulario para enviar notificaciones:
  - Campo título (máx 50 caracteres)
  - Campo mensaje (máx 200 caracteres)
  - Validación en tiempo real
  - Vista previa antes de enviar
- Envío de notificaciones locales de prueba

### **WelcomeHome.tsx** (Pantalla inicial)
- Diseño atractivo con logo
- Lista de características de la app
- Botones de acción principales
- Responsive y adaptativo

## 🔄 Flujo Completo

```
WelcomeHome
    ├── "Iniciar Sesión" → Login
    │   ├── Usuario → UserTabs
    │   └── Empresa → EmpresaTabs
    ├── "Crear Cuenta" → Register
    └── "Continuar como invitado" → GuestTabs
```

## ✨ Características Técnicas

### **Responsive Design**
- Uso de `Dimensions.get('window')` para tamaños adaptativos
- Márgenes y padding que se ajustan al tamaño de pantalla
- Fuentes escalables según el ancho del dispositivo

### **Navegación Robusta**
- Manejo de errores con try/catch
- Alertas informativas para el usuario
- Navegación tipada con TypeScript

### **Notificaciones Push**
- Configuración automática en App.tsx
- Listeners para notificaciones recibidas y respuestas
- Servicio completo en `utils/notifications.ts`

### **Validación de Formularios**
- Formik + Yup para validación robusta
- Feedback visual en tiempo real
- Mensajes de error específicos

## 🎯 Beneficios del Nuevo Flujo

1. **Experiencia Clara**: Los usuarios entienden inmediatamente sus opciones
2. **Acceso Rápido**: Los invitados pueden explorar sin registro
3. **Funcionalidades Específicas**: Cada tipo de usuario ve solo lo relevante
4. **Diseño Moderno**: Interfaz atractiva y profesional
5. **Navegación Intuitiva**: Flujo lógico y fácil de seguir

## 🔧 Configuración Técnica

### **Dependencias Utilizadas**
- `expo-notifications`: Notificaciones push y locales
- `@react-navigation/*`: Navegación entre pantallas
- `formik` + `yup`: Validación de formularios
- `react-native-safe-area-context`: Áreas seguras

### **Estructura de Archivos**
```
app/
├── screens/
│   ├── WelcomeHome.tsx (Nueva)
│   ├── HomeUsuario.tsx (Mejorada)
│   └── EmpresaPanel.tsx (Nueva)
├── navigation/
│   ├── GuestTabs.tsx (Nueva)
│   ├── UserTabs.tsx (Nueva)
│   └── EmpresaTabs.tsx (Nueva)
└── auth/
    └── Login.tsx (Mejorado)
```

Este flujo proporciona una experiencia de usuario completa y profesional, con navegación clara y funcionalidades específicas para cada tipo de usuario.