import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils';

type RecipeItem = {
  id: string;
  title: string;
  image: string;
};

const DATA: RecipeItem[] = [
  { id: '1', title: 'Fernet con cola', image: 'https://images.unsplash.com/photo-1546171753-97d7676f85b9?w=800' },
  { id: '2', title: 'Mojito', image: 'https://images.unsplash.com/photo-1551022370-1b5f3f3f9c54?w=800' },
  { id: '3', title: 'Negroni', image: 'https://images.unsplash.com/photo-1604908554025-7d9b38787d0d?w=800' },
  { id: '4', title: 'Daiquiri', image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800' },
];

export default function RecipesScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate('DetalleReceta', { id: item.id })}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>Toque para ver la receta</Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: { backgroundColor: 'rgba(255,255,255,0.98)', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#EEF2FF' },
  image: { width: '100%', height: 160 },
  info: { padding: 12 },
  title: { fontSize: 16, fontWeight: '700', color: colors.primary },
  meta: { marginTop: 4, color: colors.muted },
});


