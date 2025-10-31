# 🔄 Flujo de Navegación Actualizado - DrinkMate

## 📱 Flujo Principal Restaurado

### **1. Pantalla Inicial: Home**
- **Ubicación**: `app/screens/Home.tsx`
- **Función**: Pantalla de bienvenida con información de la app
- **Botones principales**:
  - 🙋‍♂️ **"Soy Usuario"** → `AuthManager` (Login/Registro usuarios)
  - 🏢 **"Soy Empresa"** → `EmpresaAuthManager` (Login/Registro empresas)
  - 👁️ **"Explorar como invitado"** → `UserTabs` (Acceso sin cuenta)

### **2. Flujos de Autenticación**

#### **👤 Usuarios Normales**
```
Home → "Soy Usuario" → AuthManager
├── "Crear Cuenta" → Registro → Login automático → UserTabs
├── "Iniciar Sesión" → Login → UserTabs
└── "Continuar sin cuenta" → UserTabs (modo invitado)
```

#### **🏢 Empresas**
```
Home → "Soy Empresa" → EmpresaAuthManager
├── "Registrar Empresa" → RegistroEmpresa
│   ├── Sin cuenta → Volver a Home
│   └── Con cuenta → Login → EmpresaPanel
└── "Acceso Empresas" → Login → EmpresaPanel
```

#### **👁️ Invitados**
```
Home → "Explorar como invitado" → UserTabs
├── HomeUsuario (funcionalidad limitada)
├── Ver cupones disponibles
├── Explorar bares y tragos
└── Opción de registrarse después
```

### **3. Pantallas Principales**

#### **UserTabs** (Usuarios y invitados)
- **Inicio**: `HomeUsuario` - Dashboard personalizado
- **Explorar**: `Home` - Catálogo de tragos
- **Trivia**: `TriviaScreen` - Juegos
- **Cupones**: `CuponesUsuario` - Cupones disponibles
- **Mapa**: `MapScreen` - Bares cercanos
- **Favoritos**: `FavoritesScreen` - Guardados
- **Subir**: `UploadDrinkScreen` - Compartir tragos

#### **EmpresaPanel** (Solo empresas autenticadas)
- **Notificaciones**: Enviar mensajes a usuarios
- **Cupones**: Crear y gestionar promociones
- **Estadísticas**: Ver rendimiento (futuro)

### **4. Funcionalidades por Tipo de Usuario**

#### **👁️ Invitado (Sin cuenta)**
- ✅ Ver cupones disponibles
- ✅ Explorar bares y tragos
- ✅ Usar mapa y favoritos locales
- ✅ Jugar trivia
- ❌ Notificaciones personalizadas
- ❌ Historial persistente
- ❌ Sincronización entre dispositivos

#### **👤 Usuario Registrado**
- ✅ Todo lo de invitado +
- ✅ Notificaciones personalizadas
- ✅ Historial y favoritos sincronizados
- ✅ Perfil personalizado
- ✅ Datos persistentes en Firebase

#### **🏢 Empresa Registrada**
- ✅ Panel de gestión completo
- ✅ Crear y editar cupones
- ✅ Enviar notificaciones a usuarios
- ✅ Ver estadísticas de cupones
- ✅ Gestionar perfil de empresa

### **5. Navegación Inteligente**

#### **Contextos Integrados**
- `AppAuthProvider` envuelve toda la app
- `useAppAuth()` disponible en cualquier componente
- Detección automática del tipo de usuario

#### **Componentes Adaptativos**
- `SmartHeader` se adapta según el usuario
- `AuthenticatedApp` renderiza la pantalla correcta
- Navegación contextual automática

### **6. Persistencia y Sincronización**

#### **Firebase Integration**
- **Authentication**: Sesiones persistentes con AsyncStorage
- **Firestore**: Datos sincronizados en tiempo real
- **Fallbacks**: Funciona offline con datos locales

#### **Notificaciones**
- **Locales**: Funcionan en Expo Go
- **Push**: Preparado para desarrollo build
- **Personalizadas**: Por tipo de usuario

## 🎯 Beneficios del Flujo Actualizado

1. **🎨 Experiencia Familiar**: Mantiene la pantalla Home original
2. **🔄 Flexibilidad**: Usuarios pueden elegir su camino
3. **👁️ Acceso Inmediato**: Invitados pueden usar la app sin registro
4. **🏢 Separación Clara**: Flujos distintos para usuarios y empresas
5. **📱 Progresivo**: Invitados pueden registrarse cuando quieran
6. **🔒 Seguro**: Autenticación robusta cuando se necesita

## 🧪 Para Probar el Flujo Completo

1. **Inicia la app** → Verás la pantalla Home
2. **Prueba "Explorar como invitado"** → Acceso inmediato a UserTabs
3. **Prueba "Soy Usuario"** → Flujo de registro/login
4. **Prueba "Soy Empresa"** → Registro completo con logo y datos
5. **Verifica persistencia** → Cierra y abre la app

¡El flujo ahora respeta la experiencia original mientras integra todas las nuevas funcionalidades! 🚀