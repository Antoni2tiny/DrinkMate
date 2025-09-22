import { View, Text, StyleSheet, Pressable, ImageBackground, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../utils';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <ImageBackground
        source={require('../../assets/hero-bg .jpg')}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <View style={styles.overlay} />
        <View style={styles.heroContent}>
          <Text style={styles.brand}>DrinkGo</Text>
          <Text style={styles.tagline}>Recetas, bares cercanos y tus tragos favoritos en un solo lugar.</Text>
          <View style={styles.ctaRow}>
            <Pressable style={[styles.cta, styles.ctaPrimary]} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.ctaPrimaryText}>Empezar / Login</Text>
            </Pressable>
            <Pressable style={[styles.cta, styles.ctaGhost]} onPress={() => navigation.navigate('Mapa')}>
              <Text style={styles.ctaGhostText}>Ver mapa</Text>
            </Pressable>
          </View>
          <View style={styles.ctaRow}>
            <Pressable style={[styles.cta, styles.ctaGhost]} onPress={() => navigation.navigate('Favoritos')}>
              <Text style={styles.ctaGhostText}>Favoritos</Text>
            </Pressable>
            <Pressable style={[styles.cta, styles.ctaGhost]} onPress={() => navigation.navigate('Subir')}>
              <Text style={styles.ctaGhostText}>Subí tu trago</Text>
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
        </View>
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
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cta: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minWidth: 150 },
  ctaPrimary: { backgroundColor: colors.primary },
  ctaPrimaryText: { color: '#fff', fontWeight: '700' },
  ctaGhost: { backgroundColor: 'rgba(255,255,255,0.95)' },
  ctaGhostText: { color: colors.primary, fontWeight: '700' },

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

  footerCta: { paddingHorizontal: 16, paddingBottom: 10 },
});


