import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils';

// Importar pantallas para empresas
import EmpresaPanel from "../screens/EmpresaPanel";
import HomeScreen from "../screens/Home";
import MapScreen from "../screens/Map";

const Tabs = createBottomTabNavigator();

export default function EmpresaTabs() {
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
          
          if (route.name === 'Panel') iconName = focused ? 'business' : 'business-outline';
          if (route.name === 'Explorar') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Mapa') iconName = focused ? 'map' : 'map-outline';
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen 
        name="Panel" 
        component={EmpresaPanel}
        options={{ title: 'Panel' }}
      />
      <Tabs.Screen 
        name="Explorar" 
        component={HomeScreen}
        options={{ title: 'Explorar' }}
      />
      <Tabs.Screen 
        name="Mapa" 
        component={MapScreen}
        options={{ title: 'Mapa' }}
      />
    </Tabs.Navigator>
  );
}