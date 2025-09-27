import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TragoList, { type Bebida } from './components/TragoList';


export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tragos Favoritos</Text>
      <TragoList data={bebidasGuardadas} emptyText='Aquí verás tragos favoritos.' />
      <Text style={styles.subtitle}></Text>

      <Pressable style={styles.fab} onPress={() => console.log('FAB PRESSED')}>
        <Text style={styles.fabText}>+</Text>
      
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginTop: 16 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#007BFF',
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // sombra Android
    shadowColor: '#000', // sombra iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
});



// JSON de ejemplo
const bebidasGuardadas: Bebida[] = [
  {
    id: '1',
    nombre: 'Margarita',
    nota: 'Un clásico que nunca falla 😎',
    foto: { uri: 'https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg' },
    receta: { uri: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita' },
  },
  {
    id: '2',
    nombre: 'Blue Lagoon',
    nota: 'Dulce y azul 💙',
    foto: { uri: 'https://www.thecocktaildb.com/images/media/drink/5wm4zo1582579154.jpg' },
    receta: { uri: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=blue_lagoon' },
  },
  {
    id: '3',
    nombre: 'Tequila Sunrise',
    nota: 'Naranja y roja, como un amanecer 🌅',
    foto: { uri: 'https://www.thecocktaildb.com/images/media/drink/quqyqp1480879103.jpg' },
    receta: { uri: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=tequila_sunrise' },
  },
];
const bebidasGuardadasV: Bebida[] = [];
