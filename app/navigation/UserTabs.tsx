import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils';

// Importar pantallas para usuarios logueados
import HomeUsuario from "../screens/HomeUsuario";
import HomeScreen from "../screens/Home";
import MapScreen from "../screens/Map";
import CuponesUsuario from "../screens/CuponesUsuario";

// Importar pantallas protegidas
import ProtectedTrivia from "../screens/ProtectedTrivia";
import ProtectedUpload from "../screens/ProtectedUpload";
import ProtectedFavorites from "../screens/ProtectedFavorites";

const Tabs = createBottomTabNavigator();

export default function UserTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          
          if (route.name === 'Inicio') iconName = focused ? 'person' : 'person-outline';
          if (route.name === 'Explorar') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Trivia') iconName = focused ? 'game-controller' : 'game-controller-outline';
          if (route.name === 'Cupones') iconName = focused ? 'pricetag' : 'pricetag-outline';
          if (route.name === 'Mapa') iconName = focused ? 'map' : 'map-outline';
          if (route.name === 'Favoritos') iconName = focused ? 'heart' : 'heart-outline';
          if (route.name === 'Subir') iconName = focused ? 'add-circle' : 'add-circle-outline';
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen 
        name="Inicio" 
        component={HomeUsuario}
        options={{ title: 'Inicio' }}
      />
      <Tabs.Screen 
        name="Explorar" 
        component={HomeScreen}
        options={{ title: 'Explorar' }}
      />
      <Tabs.Screen 
        name="Trivia" 
        component={ProtectedTrivia}
        options={{ title: 'Trivia' }}
      />
      <Tabs.Screen 
        name="Cupones" 
        component={CuponesUsuario}
        options={{ title: 'Cupones' }}
      />
      <Tabs.Screen 
        name="Mapa" 
        component={MapScreen}
        options={{ title: 'Mapa' }}
      />
      <Tabs.Screen 
        name="Favoritos" 
        component={ProtectedFavorites}
        options={{ title: 'Favoritos' }}
      />
      <Tabs.Screen 
        name="Subir" 
        component={ProtectedUpload}
        options={{ title: 'Subir' }}
      />
    </Tabs.Navigator>
  );
}