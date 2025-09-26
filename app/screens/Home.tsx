import { View, Text, StyleSheet, Pressable, ImageBackground, ScrollView, Image, FlatList, ActivityIndicator, Alert, TextInput, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../utils';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Linking } from 'react-native';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [drinks, setDrinks] = useState<Array<{ idDrink: string; strDrink: string; strDrinkThumb: string }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(10);

  const fetchDrinks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setDrinks(Array.isArray(data?.drinks) ? data.drinks : []);
    } catch (e) {
      setError('Error al cargar tragos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrinks();
  }, [fetchDrinks]);

  const visibleDrinks = useMemo(() => drinks.slice(0, visibleCount), [drinks, visibleCount]);

  const handleEndReached = useCallback(() => {
    if (visibleCount < drinks.length) {
      setVisibleCount(count => Math.min(count + 10, drinks.length));
    }
  }, [visibleCount, drinks.length]);

  const handleOpenCatalog = useCallback(() => {
    Linking.openURL('https://www.thecocktaildb.com');
  }, []);

  const handlePressDrink = useCallback((item: { idDrink: string; strDrink: string }) => {
    Alert.alert('Trago', `${item.strDrink}`);
  }, []);

  const suggestedSlides = useMemo(() => ([
    {
      key: 's1',
      title: 'Margarita',
      description: 'Clásico refrescante con tequila, lima y sal en el borde.',
      image: require('../../assets/margarita.png'),
    },
    {
      key: 's2',
      title: 'Negroni',
      description: 'Gin, vermut rosso y Campari. Amargo y balanceado.',
      image: require('../../assets/Negroni.jpg'),
    },
    {
      key: 's3',
      title: 'Old Fashioned',
      description: 'Whisky, azúcar y bitter. Elegancia en vaso bajo.',
      image: require('../../assets/oldFashioned.jpg'),
    },
  ]), []);

  const carouselRef = useRef<ScrollView>(null);
  const [carouselWidth, setCarouselWidth] = useState<number>(Dimensions.get('window').width - 32);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCarouselIndex((prev) => {
        const next = (prev + 1) % suggestedSlides.length;
        const x = next * carouselWidth;
        carouselRef.current?.scrollTo({ x, animated: true });
        return next;
      });
    }, 3500);
    return () => clearInterval(id);
  }, [carouselWidth, suggestedSlides.length]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <ImageBackground
        source={require('../../assets/hero-bg.jpg')}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <View style={styles.overlay} />
        <View style={styles.heroContent}>
          <Text style={styles.brand}>DrinkGo</Text>
          <Text style={styles.tagline}>Recetas, bares cercanos y tus tragos favoritos en un solo lugar.</Text>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Buscar cóctel..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              returnKeyType="search"
            />
          </View>
          <View style={styles.ctaRow}>
            <Pressable style={[styles.cta, styles.ctaPrimary]} onPress={() => navigation.navigate('Login')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="log-in" size={18} color="#fff" />
                <Text style={styles.ctaPrimaryText}>Empezar / Login</Text>
              </View>
            </Pressable>
            <Pressable style={[styles.cta, styles.ctaGhost]} onPress={() => navigation.navigate('Mapa')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="map" size={18} color={colors.primary} />
                <Text style={styles.ctaGhostText}>Ingresar al mapa</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>¿Qué ofrece DrinkGo?</Text>
        <View style={styles.features}>
          <View style={[styles.featureCard, { backgroundColor: colors.surface }]}><Text style={[styles.featureTitle, { color: colors.primary }]}>Recetas</Text><Text style={[styles.featureText, { color: colors.muted }]}>Encuentra cócteles por nombre o ingrediente.</Text></View>
          <View style={[styles.featureCard, { backgroundColor: colors.surface }]}><Text style={[styles.featureTitle, { color: colors.primary }]}>Mapa</Text><Text style={[styles.featureText, { color: colors.muted }]}>Bares y licorerías cerca tuyo.</Text></View>
          <View style={[styles.featureCard, { backgroundColor: colors.surface }]}><Text style={[styles.featureTitle, { color: colors.primary }]}>Favoritos</Text><Text style={[styles.featureText, { color: colors.muted }]}>Guarda bebidas y lugares.</Text></View>
          <View style={[styles.featureCard, { backgroundColor: colors.surface }]}><Text style={[styles.featureTitle, { color: colors.primary }]}>Crea</Text><Text style={[styles.featureText, { color: colors.muted }]}>Sube tus tragos con foto.</Text></View>
          <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.featureTitle, { color: colors.primary }]}>Trivia</Text>
            <Text style={[styles.featureText, { color: colors.muted }]}>Juego de preguntas con categorías para poner a prueba tus conocimientos y sumar puntaje.</Text>
          </View>
        </View>
      </View>

      {/* Ocultamos toda la sección de accesos rápidos sin borrar su lógica/JSX */}
      <View style={[styles.sectionCard, styles.hidden]}>
        <Text style={styles.sectionTitle}>Accesos rápidos</Text>
        <View style={styles.quickGrid}>
          <Pressable
            onPress={() => navigation.navigate('Recetas')}
            style={({ pressed }) => [
              styles.quickButton,
              pressed && styles.quickButtonPressed,
            ]}
          >
            <Ionicons name="wine" size={24} color={colors.primary} />
            <Text style={styles.quickText}>Recetas</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Mapa')}
            style={({ pressed }) => [
              styles.quickButton,
              pressed && styles.quickButtonPressed,
            ]}
          >
            <Ionicons name="map" size={24} color={colors.primary} />
            <Text style={styles.quickText}>Ver mapa</Text>
          </Pressable>
          {/* Ocultamos visualmente accesos antiguos: Favoritos, Subí tu trago (no borrados) */}
          <Pressable
            onPress={() => navigation.navigate('Favoritos')}
            style={({ pressed }) => [
              styles.quickButton,
              styles.hidden,
              pressed && styles.quickButtonPressed,
            ]}
          >
            <Ionicons name="heart" size={24} color={colors.primary} />
            <Text style={styles.quickText}>Favoritos</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Subir')}
            style={({ pressed }) => [
              styles.quickButton,
              styles.hidden,
              pressed && styles.quickButtonPressed,
            ]}
          >
            <Ionicons name="add-circle" size={24} color={colors.primary} />
            <Text style={styles.quickText}>Subí tu trago</Text>
          </Pressable>
          {/* Eliminamos visualmente Trivia y Clima de los accesos */}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Tendencias</Text>
        <View onLayout={(e) => setCarouselWidth(e.nativeEvent.layout.width)}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            onMomentumScrollEnd={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              const idx = carouselWidth > 0 ? Math.round(x / carouselWidth) : 0;
              setCarouselIndex(Math.max(0, Math.min(idx, suggestedSlides.length - 1)));
            }}
          >
            {suggestedSlides.map((slide) => (
              <View key={slide.key} style={[styles.slide, { width: carouselWidth }]}> 
                <Image source={slide.image} style={styles.slideImage} />
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideDesc}>{slide.description}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.dotsRow}>
            {suggestedSlides.map((s, i) => (
              <View key={s.key} style={[styles.dot, i === carouselIndex && styles.dotActive]} />
            ))}
          </View>
        </View>
        <Pressable style={[styles.cta, styles.ctaOutline]} onPress={handleOpenCatalog}>
          <Text style={styles.ctaOutlineText}>Ver más en TheCocktailDB</Text>
        </Pressable>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Confían en nosotros</Text>
        <View style={styles.references}>
          <View style={styles.badge}><Text style={styles.badgeText}>🍸 MixClub</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>🏙️ CityBars</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>🌴 TikiHouse</Text></View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.logosRow}>
          <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/240px-React-icon.svg.png' }} style={styles.logo} />
          <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Five-pointed_star.svg/240px-Five-pointed_star.svg.png' }} style={styles.logo} />
          <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/OOjs_UI_icon_heart.svg/240px-OOjs_UI_icon_heart.svg.png' }} style={styles.logo} />
          <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Solid_circle.svg/240px-Solid_circle.svg.png' }} style={styles.logo} />
          <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/OOjs_UI_icon_mapPin-progressive.svg/240px-OOjs_UI_icon_mapPin-progressive.svg.png' }} style={styles.logo} />
        </ScrollView>
      </View>

      <View style={styles.footerCta}>
        <Pressable style={[styles.cta, styles.ctaPrimary]} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.ctaPrimaryText}>Crear cuenta / Iniciar sesión</Text>
        </Pressable>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: { height: 420, justifyContent: 'flex-end' },
  heroImage: { resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  heroContent: { padding: 20 },
  brand: { color: '#fff', fontSize: 40, fontWeight: '800' },
  tagline: { color: '#fff', fontSize: 16, marginTop: 6, lineHeight: 22 },
  searchBar: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  searchInput: { flex: 1, color: '#111' },
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cta: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minWidth: 150 },
  ctaPrimary: { backgroundColor: colors.primary },
  ctaPrimaryText: { color: '#fff', fontWeight: '700' },
  ctaGhost: { backgroundColor: 'rgba(255,255,255,0.95)' },
  ctaGhostText: { color: colors.primary, fontWeight: '700' },
  ctaOutline: { borderWidth: 1, borderColor: colors.primary, backgroundColor: 'transparent', marginTop: 12 },
  ctaOutlineText: { color: colors.primary, fontWeight: '700' },

  section: { paddingHorizontal: 16, paddingVertical: 18 },
  sectionCard: { marginHorizontal: 16, marginTop: 18, padding: 16, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2FF' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, color: colors.primary },
  features: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  featureCard: { flexBasis: '48%', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#EEF2FF' },
  featureTitle: { fontWeight: '700', marginBottom: 6 },
  featureText: { },

  references: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  badge: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  badgeText: { color: '#fff', fontWeight: '700' },
  logosRow: { paddingTop: 12, gap: 16, paddingHorizontal: 6, alignItems: 'center' },
  logo: { width: 90, height: 44, resizeMode: 'contain' },

  // Tendencias
  loaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loaderText: { color: colors.muted },
  errorText: { color: colors.accent, marginRight: 6 },
  retryBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#EEF2FF' },
  retryText: { color: colors.primary, fontWeight: '700' },
  trendsList: { gap: 12 },
  trendItem: { width: 110, marginRight: 8, alignItems: 'center' },
  trendImage: { width: 72, height: 72, borderRadius: 12, backgroundColor: '#E5E7EB' },
  trendName: { marginTop: 8, fontWeight: '700', color: colors.text },
  trendCategory: { color: colors.muted, fontSize: 12 },

  // Carousel sugeridos
  carouselContent: { gap: 12 },
  slide: { width: 260, marginRight: 12 },
  slideImage: { width: '100%', height: 140, borderRadius: 12 },
  slideTitle: { marginTop: 10, fontWeight: '700', color: colors.primary },
  slideDesc: { color: colors.muted },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E5E7EB' },
  dotActive: { backgroundColor: colors.primary },

  footerCta: { paddingHorizontal: 16, paddingBottom: 10 },

  // Quick access grid
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  quickButton: {
    flexBasis: '48%',
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF2FF',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    // shadow (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    // elevation (Android)
    elevation: 2,
  },
  quickButtonPressed: { transform: [{ scale: 0.98 }], opacity: 0.95 },
  quickText: { color: colors.primary, fontWeight: '700' },
  hidden: { display: 'none' },
});