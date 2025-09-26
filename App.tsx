import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from "./app/auth/Login";
import HomeScreen from "./app/screens/Home";
import TriviaScreen from "./app/screens/Trivia";
import RecipesScreen from "./app/screens/Recipes";

import MapScreen from "./app/screens/Map";
import FavoritesScreen from "./app/screens/favorites/Favorites";
import UploadDrinkScreen from "./app/screens/UploadDrink";
import RecipeDetailScreen from "./app/screens/RecipeDetail";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#111',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          if (route.name === 'Inicio') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Recetas') iconName = focused ? 'wine' : 'wine-outline';
          
          if (route.name === 'Trivia') iconName = focused ? 'game-controller' : 'game-controller-outline';
          if (route.name === 'Mapa') iconName = focused ? 'map' : 'map-outline';
          if (route.name === 'Favoritos') iconName = focused ? 'heart' : 'heart-outline';
          if (route.name === 'Subir') iconName = focused ? 'add-circle' : 'add-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Inicio" component={HomeScreen} />
      
      
      
      
      
      
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="DetalleReceta" component={RecipeDetailScreen} options={{ title: 'Receta' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
