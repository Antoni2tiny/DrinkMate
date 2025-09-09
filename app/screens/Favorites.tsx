import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tus favoritos</Text>
      <Text>Aquí verás bebidas y bares guardados.</Text>
      <Pressable style={styles.homeBtn} onPress={() => navigation.navigate('Inicio')}>
        <Text style={styles.homeBtnText}>Volver a inicio</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  homeBtn: { position: 'absolute', bottom: 24, left: 16, right: 16, backgroundColor: '#111', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  homeBtnText: { color: '#fff', fontWeight: '700' },
});


