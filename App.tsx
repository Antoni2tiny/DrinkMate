import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from "./app/auth/Login";
import HomeScreen from "./app/screens/Home";
import TriviaScreen from "./app/screens/Trivia";
import RecipesScreen from "./app/screens/Recipes";
import WeatherSuggestionsScreen from "./app/screens/WeatherSuggestions";
import MapScreen from "./app/screens/Map";
import FavoritesScreen from "./app/screens/Favorites";
import UploadDrinkScreen from "./app/screens/UploadDrink";
import RecipeDetailScreen from "./app/screens/RecipeDetail";
import Register from './app/auth/Register';
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
          if (route.name === 'Clima') iconName = focused ? 'partly-sunny' : 'partly-sunny-outline';
          if (route.name === 'Trivia') iconName = focused ? 'game-controller' : 'game-controller-outline';
          if (route.name === 'Mapa') iconName = focused ? 'map' : 'map-outline';
          if (route.name === 'Favoritos') iconName = focused ? 'heart' : 'heart-outline';
          if (route.name === 'Subir') iconName = focused ? 'add-circle' : 'add-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Inicio" component={HomeScreen} />
      <Tabs.Screen name="Recetas" component={RecipesScreen} />
      <Tabs.Screen name="Clima" component={WeatherSuggestionsScreen} />
      <Tabs.Screen name="Trivia" component={TriviaScreen} />
      <Tabs.Screen name="Mapa" component={MapScreen} />
      <Tabs.Screen name="Favoritos" component={FavoritesScreen} />
      <Tabs.Screen name="Subir" component={UploadDrinkScreen} />
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
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
