import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecipeDetailScreen() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: 'https://images.unsplash.com/photo-1546171753-97d7676f85b9?w=1200' }} style={styles.image} />
      <Text style={styles.title}>Nombre del trago</Text>
      <Text style={styles.subtitle}>Ingredientes</Text>
      <Text>- 50ml de ejemplo</Text>
      <Text>- 20ml de ejemplo</Text>
      <Text style={styles.subtitle}>Pasos</Text>
      <Text>1. Mezclar todo con hielo.</Text>
      <View style={styles.row}>
        <Pressable style={styles.button}><Text>Agregar a favoritos</Text></Pressable>
        <Pressable style={styles.button}><Text>Compartir</Text></Pressable>
      </View>
      <Pressable style={[styles.button, { marginTop: 16 }]} onPress={() => navigation.navigate('Inicio')}>
        <Text>Volver a inicio</Text>
      </Pressable>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: { width: '100%', height: 220, borderRadius: 12, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { marginTop: 12, marginBottom: 6, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 12, marginTop: 16 },
  button: { backgroundColor: '#eee', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
});


