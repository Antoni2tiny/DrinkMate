import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

// Importar los providers de autenticación
import { AppAuthProvider } from './app/context/AppAuthProvider';
import { AppInitializer } from './utils/appInitializer';

// Importar pantallas existentes
import Login from "./app/auth/Login";
import HomeScreen from "./app/screens/Home";
import TriviaScreen from "./app/screens/Trivia";
import RecipesScreen from "./app/screens/Recipes";
import MapScreen from "./app/screens/Map";
import FavoritesScreen from "./app/screens/favorites/Favorites";
import UploadDrinkScreen from "./app/screens/UploadDrink";
import RecipeDetailScreen from "./app/screens/RecipeDetail";
import Register from './app/auth/Register';

// Importar nuevas pantallas
import HomeUsuario from "./app/screens/HomeUsuario";
import EmpresaPanel from "./app/screens/EmpresaPanel";
import UserTypeSelection from "./app/screens/UserTypeSelection";
import WelcomeHome from "./app/screens/WelcomeHome";
import AuthOptions from "./app/screens/AuthOptions";
import AuthManager from "./app/screens/AuthManager";
import EmpresaAuthManager from "./app/screens/EmpresaAuthManager";
import RegistroEmpresa from "./app/screens/RegistroEmpresa";

// Importar navegaciones
import GuestTabs from "./app/navigation/GuestTabs";
import UserTabs from "./app/navigation/UserTabs";
import EmpresaTabs from "./app/navigation/EmpresaTabs";
const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6C2BD9',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          
          // Iconos para las nuevas pantallas
          if (route.name === 'Inicio') iconName = focused ? 'person' : 'person-outline';
          if (route.name === 'Empresa') iconName = focused ? 'business' : 'business-outline';
          
          // Iconos existentes
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Mapa') iconName = focused ? 'map' : 'map-outline';
          if (route.name === 'Favoritos') iconName = focused ? 'heart' : 'heart-outline';
          if (route.name === 'Subir') iconName = focused ? 'add-circle' : 'add-circle-outline';
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Nuevas pantallas principales */}
      <Tabs.Screen 
        name="Inicio" 
        component={HomeUsuario}
        options={{ title: 'Inicio' }}
      />
      <Tabs.Screen 
        name="Empresa" 
        component={EmpresaPanel}
        options={{ title: 'Empresa' }}
      />
      
      {/* Pantallas existentes */}
      <Tabs.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Explorar' }}
      />
      <Tabs.Screen 
        name="Mapa" 
        component={MapScreen}
        options={{ title: 'Mapa' }}
      />
      <Tabs.Screen 
        name="Favoritos" 
        component={FavoritesScreen}
        options={{ title: 'Favoritos' }}
      />
      <Tabs.Screen 
        name="Subir" 
        component={UploadDrinkScreen}
        options={{ title: 'Subir' }}
      />
    </Tabs.Navigator>
  );
}

export default function App() {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Inicializar la aplicación
    AppInitializer.initializeApp();

    // Configurar el manejador de notificaciones (backup)
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Listener para notificaciones recibidas mientras la app está en primer plano
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
    });

    // Listener para cuando el usuario toca una notificación
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Respuesta a notificación:', response);
      
      // Aquí puedes manejar la navegación basada en la notificación
      const notificationData = response.notification.request.content.data;
      if (notificationData?.screen) {
        // Navegar a una pantalla específica si se especifica en los datos
        console.log('Navegar a:', notificationData.screen);
      }
    });

    // Cleanup listeners al desmontar
    return () => {
      try {
        if (notificationListener.current && typeof notificationListener.current.remove === 'function') {
          notificationListener.current.remove();
        }
        if (responseListener.current && typeof responseListener.current.remove === 'function') {
          responseListener.current.remove();
        }
      } catch (error) {
        console.log('Error limpiando listeners de notificaciones:', error);
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AppAuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="AuthOptions" 
              component={AuthOptions} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="WelcomeHome" 
              component={WelcomeHome} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Login" 
              component={Login} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Register" 
              component={Register} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="UserTypeSelection" 
              component={UserTypeSelection} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="GuestTabs" 
              component={GuestTabs} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="UserTabs" 
              component={UserTabs} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="EmpresaTabs" 
              component={EmpresaTabs} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Main" 
              component={MainTabs} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="DetalleReceta" 
              component={RecipeDetailScreen} 
              options={{ 
                title: 'Receta',
                headerStyle: { backgroundColor: '#6C2BD9' },
                headerTintColor: '#FFFFFF',
              }} 
            />
            <Stack.Screen 
              name="AuthManager" 
              component={AuthManager} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="EmpresaAuthManager" 
              component={EmpresaAuthManager} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="RegistroEmpresa" 
              component={RegistroEmpresa} 
              options={{ headerShown: false }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppAuthProvider>
    </SafeAreaProvider>
  );
}
