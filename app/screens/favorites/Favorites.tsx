import { View, Text, StyleSheet, ActivityIndicator, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getFavorites, removeFavorite, FavoriteDrink } from '../../../utils/firebaseFavorites';
import { colors } from '../../../utils';
import { getAuth } from 'firebase/auth';
import FavoriteDrinksList from './components/FavoriteDrinksList';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserTabParamList, RootStackParamList } from '../../navigation/types';
import { CompositeNavigationProp } from '@react-navigation/native';

type FavoritesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<UserTabParamList, 'Favoritos'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteDrink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const auth = getAuth();
  const navigation = useNavigation<FavoritesScreenNavigationProp>();

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedFavorites = await getFavorites();
      setFavorites(fetchedFavorites);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      Alert.alert('Error', 'No se pudieron cargar tus favoritos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchFavorites();
      } else {
        setFavorites([]);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [fetchFavorites]);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          fetchFavorites();
        } else {
          setFavorites([]);
          setLoading(false);
        }
      });
      return unsubscribe;
    }, [fetchFavorites])
  );

  const handleDeleteFavorite = useCallback(async (drinkId: string) => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'Debes iniciar sesión para eliminar favoritos.');
      return;
    }

    try {
      const success = await removeFavorite(drinkId);
      if (success) {
        Alert.alert('Éxito', 'Bebida eliminada de favoritos.');
        fetchFavorites(); // Recargar la lista de favoritos
      } else {
        Alert.alert('Error', 'No se pudo eliminar la bebida de favoritos.');
      }
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
      Alert.alert('Error', 'Ocurrió un error al intentar eliminar el favorito.');
    }
  }, [auth.currentUser, fetchFavorites]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.muted, marginTop: 10 }}>Cargando favoritos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tragos Favoritos</Text>
      <FavoriteDrinksList favorites={favorites} onDeleteFavorite={handleDeleteFavorite} />
      <Pressable style={styles.fab} onPress={() => navigation.navigate('Subir')}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20, color: colors.primary, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.muted, marginTop: 16, textAlign: 'center' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: colors.primary,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 10,
  },
  emptyIcon: {
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
