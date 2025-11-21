import { View, Text, StyleSheet, Image, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';
import { colors } from '../../utils';
import { addFavorite, removeFavorite, isFavorite, FavoriteDrink } from '../../utils/firebaseFavorites';
import { getAuth } from 'firebase/auth';

interface DrinkType {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory?: string;
  strAlcoholic?: string;
  strGlass?: string;
  strInstructions?: string;
  strInstructionsES?: string;
  [key: string]: string | undefined; // Para strIngredient y strMeasure dinámicos
}

type DetailRoute = RouteProp<Record<string, { idDrink: string }>, string>;

export default function RecipeDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<DetailRoute>();
  const idDrink = route.params?.idDrink;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [drink, setDrink] = useState<DrinkType | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const auth = getAuth(); // Obtener la instancia de Auth

  useEffect(() => {
    let isMounted = true;
    const fetchDetailAndFavoriteStatus = async () => {
      if (!idDrink) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`);
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        const item: DrinkType | null = Array.isArray(data?.drinks) ? data.drinks[0] : null;

        if (isMounted) {
          setDrink(item);
          if (item) {
            const favorited = await isFavorite(item.idDrink);
            setIsFavorited(favorited);
          }
        }
      } catch (e) {
        if (isMounted) setError('Error al cargar detalle');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDetailAndFavoriteStatus();
    return () => {
      isMounted = false;
    };
  }, [idDrink]);

  const handleToggleFavorite = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'Debes iniciar sesión para gestionar tus favoritos.');
      return;
    }
    if (!drink) {
      Alert.alert('Error', 'No se pudo obtener la información de la bebida.');
      return;
    }

    try {
      if (isFavorited) {
        const success = await removeFavorite(drink.idDrink);
        if (success) {
          setIsFavorited(false);
          Alert.alert('Éxito', `"${drink.strDrink}" eliminado de favoritos.`);
        } else {
          Alert.alert('Error', `No se pudo eliminar "${drink.strDrink}" de favoritos.`);
        }
      } else {
        const favoriteData: FavoriteDrink = {
          idDrink: drink.idDrink,
          strDrink: drink.strDrink,
          strDrinkThumb: drink.strDrinkThumb,
          strCategory: drink.strCategory,
          strAlcoholic: drink.strAlcoholic,
          strGlass: drink.strGlass,
          timestamp: null, // Será reemplazado por serverTimestamp()
        };
        const success = await addFavorite(favoriteData);
        if (success) {
          setIsFavorited(true);
          Alert.alert('Éxito', `"${drink.strDrink}" añadido a favoritos.`);
        } else {
          Alert.alert('Error', `No se pudo añadir "${drink.strDrink}" a favoritos.`);
        }
      }
    } catch (e) {
      console.error('Error al alternar favorito:', e);
      Alert.alert('Error', 'Ocurrió un error al intentar guardar/eliminar el favorito.');
    }
  };

  const ingredients: Array<string> = useMemo(() => {
    if (!drink) return [];
    const list: Array<string> = [];
    for (let i = 1; i <= 15; i++) {
      const ing = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ing) list.push(measure ? `${measure} ${ing}` : `${ing}`);
    }
    return list;
  }, [drink]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <View style={styles.center}> 
            <ActivityIndicator color={colors.primary} />
            <Text style={{ color: colors.muted, marginTop: 8 }}>Cargando detalle...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}> 
            <Text style={{ color: colors.accent }}>{error}</Text>
            <Pressable onPress={() => navigation.goBack()} style={[styles.button, { marginTop: 12 }]}>
              <Text style={{ color: colors.text }}>Volver</Text>
            </Pressable>
          </View>
        ) : drink ? (
          <View>
            <Image source={{ uri: drink.strDrinkThumb }} style={styles.image} />
            <Text style={styles.title}>{drink.strDrink}</Text>
            <Text style={styles.subtitle}>Ingredientes</Text>
            {ingredients.map((line, idx) => (
              <Text key={idx} style={{ color: colors.text }}>- {line}</Text>
            ))}
            <Text style={styles.subtitle}>Instrucciones</Text>
            <Text style={{ color: colors.text }}>{drink.strInstructions || '—'}</Text>
            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: isFavorited ? colors.error : colors.primary,
                  width: '100%',
                  alignItems: 'center',
                }
              ]}
              onPress={handleToggleFavorite}
            >
              <Text style={{ color: colors.background }}>
                {isFavorited ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
              </Text>
            </Pressable>
            {/* <Pressable style={styles.button}><Text style={{ color: colors.text }}>Compartir</Text></Pressable> */}
            <Pressable
              style={[
                styles.button,
                {
                  marginTop: 16,
                  alignItems: 'center',
                  backgroundColor: colors.muted,
                }
              ]}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ color: colors.background }}>Volver</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.center}> 
            <Text style={{ color: colors.muted }}>Sin datos para mostrar</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { padding: 24, alignItems: 'center' },
  image: { width: '100%', height: 260, borderRadius: 12, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, color: colors.primary },
  subtitle: { marginTop: 12, marginBottom: 6, fontWeight: '600', color: colors.primary },
  row: { flexDirection: 'row', gap: 12, marginTop: 16 },
  button: { backgroundColor: colors.surface, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#EEF2FF' },
});


