import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils';

// Importar pantallas existentes que pueden ver los invitados
import HomeScreen from "../screens/Home";
import MapScreen from "../screens/Map";
import RecipesScreen from "../screens/Recipes";
import TriviaScreen from "../screens/Trivia";

const Tabs = createBottomTabNavigator();

export default function GuestTabs() {
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

          if (route.name === 'Explorar') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Recetas') iconName = focused ? 'wine' : 'wine-outline';
          if (route.name === 'Trivia') iconName = focused ? 'game-controller' : 'game-controller-outline';
          if (route.name === 'Mapa') iconName = focused ? 'map' : 'map-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="Explorar"
        component={HomeScreen}
        options={{ title: 'Explorar' }}
      />
      <Tabs.Screen
        name="Recetas"
        component={RecipesScreen}
        options={{ title: 'Recetas' }}
      />
      <Tabs.Screen
        name="Trivia"
        component={TriviaScreen}
        options={{ title: 'Trivia' }}
      />
      <Tabs.Screen
        name="Mapa"
        component={MapScreen}
        options={{ title: 'Mapa' }}
      />
    </Tabs.Navigator>
  );
}