import { View, Text, StyleSheet, Pressable, ImageBackground, ScrollView, Image, FlatList, ActivityIndicator, Alert, TextInput, Dimensions, Modal, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';

const { width, height } = Dimensions.get('window');
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../utils';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Linking } from 'react-native';

// Tipo para los tragos de la API
type DrinkType = {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory?: string;
  strAlcoholic?: string;
  strInstructions?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strGlass?: string;
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [drinks, setDrinks] = useState<DrinkType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  // Habilitar animaciones de layout en Android
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggleFeature = useCallback((key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveFeature((prev: string | null) => (prev === key ? null : key));
  }, []);

  // Estados para búsqueda
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<DrinkType[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Estados para el modal de empresas
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  // Estados para el modal de búsqueda
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<any>(null);

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

  const handlePressDrink = useCallback((item: DrinkType) => {
    setSelectedDrink(item);
    setSearchModalVisible(false);

    // Construir lista de ingredientes
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = item[`strIngredient${i}` as keyof DrinkType];
      const measure = item[`strMeasure${i}` as keyof DrinkType];
      if (ingredient && ingredient.trim()) {
        const ingredientText = measure && measure.trim()
          ? `${measure.trim()} ${ingredient.trim()}`
          : ingredient.trim();
        ingredients.push(ingredientText);
      }
    }

    // Construir mensaje completo
    let message = `🍹 ${item.strDrink}\n\n`;

    if (item.strCategory) {
      message += `📂 Categoría: ${item.strCategory}\n`;
    }

    if (item.strAlcoholic) {
      message += `🥃 Tipo: ${item.strAlcoholic}\n`;
    }

    if (item.strGlass) {
      message += `🥛 Vaso: ${item.strGlass}\n`;
    }

    if (ingredients.length > 0) {
      message += `\n🧪 Ingredientes:\n${ingredients.map(ing => `• ${ing}`).join('\n')}\n`;
    }

    if (item.strInstructions) {
      message += `\n📝 Preparación:\n${item.strInstructions}`;
    }

    Alert.alert('Receta Completa', message, [
      { text: 'Cerrar', style: 'cancel' },
      { text: 'Ver más', onPress: () => console.log('Navegar a detalle completo') }
    ]);
  }, []);

  // Función para cerrar el modal de búsqueda
  const closeSearchModal = useCallback(() => {
    setSearchModalVisible(false);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  // Función para buscar tragos
  const searchDrinks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);

      // API de TheCocktailDB para búsqueda por nombre
      const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query.trim())}`;

      const res = await fetch(url);

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const data = await res.json();

      const results = Array.isArray(data?.drinks) ? data.drinks : [];

      setSearchResults(results);

      if (results.length === 0) {
        Alert.alert('Sin resultados', `No se encontraron tragos con "${query}"`);
      } else {
        // Mostrar modal con resultados
        setSearchModalVisible(true);
      }
    } catch (e) {
      setError('Error al buscar tragos');
      const errorMessage = e instanceof Error ? e.message : 'Error desconocido';
      Alert.alert('Error', `No se pudo realizar la búsqueda: ${errorMessage}`);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Función para manejar el envío de búsqueda
  const handleSearchSubmit = useCallback(() => {
    searchDrinks(searchQuery);
  }, [searchQuery, searchDrinks]);

  // Función para abrir el modal de empresa
  const handleCompanyPress = useCallback((company: any) => {
    setSelectedCompany(company);
    setModalVisible(true);
  }, []);

  // Función para cerrar el modal
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedCompany(null);
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

  // Datos de empresas con información detallada
  const companiesData = useMemo(() => [
    {
      id: '1',
      name: 'MixClub',
      type: 'Bar & Coctelería',
      logo: require('../../assets/MixClub.png'),
      description: 'El mejor bar de cócteles de la ciudad con una amplia selección de tragos clásicos y creaciones únicas.',
      specialties: ['Cócteles Clásicos', 'Creaciones Propias', 'Whisky Premium'],
      hours: 'Lun-Dom: 18:00 - 02:00',
      location: 'Centro de la Ciudad',
      highlights: [
        'Más de 200 tipos de licores',
        'Bartenders certificados',
        'Ambiente elegante y moderno',
        'Happy hour todos los días'
      ]
    },
    {
      id: '2',
      name: 'CityBars',
      type: 'Cadena de Bares',
      logo: require('../../assets/CityBars.png'),
      description: 'Cadena de bares urbanos con múltiples ubicaciones, ofreciendo consistencia y calidad en cada visita.',
      specialties: ['Cervezas Artesanales', 'Tragos Urbanos', 'Comida Rápida'],
      hours: 'Lun-Dom: 16:00 - 01:00',
      location: 'Múltiples ubicaciones',
      highlights: [
        '15 ubicaciones en la ciudad',
        'Precios accesibles',
        'Ambiente casual y relajado',
        'Promociones especiales'
      ]
    },
    {
      id: '3',
      name: 'TikiHouse',
      type: 'Bar Temático',
      logo: require('../../assets/TikiHouse.png'),
      description: 'Experiencia tropical única con cócteles exóticos, decoración temática y ambiente paradisíaco.',
      specialties: ['Cócteles Tropicales', 'Ron Premium', 'Bebidas Exóticas'],
      hours: 'Mar-Dom: 19:00 - 03:00',
      location: 'Zona Turística',
      highlights: [
        'Decoración tropical auténtica',
        'Más de 50 tipos de ron',
        'Cócteles con frutas frescas',
        'Shows temáticos los fines de semana'
      ]
    },
    {
      id: '4',
      name: 'WhiskyLounge',
      type: 'Whisky Bar',
      logo: require('../../assets/WhiskyLounge.png'),
      description: 'Santuario del whisky con la colección más exclusiva de destilados premium y ambiente sofisticado.',
      specialties: ['Whisky Escocés', 'Bourbon', 'Whisky Japonés'],
      hours: 'Mié-Sáb: 20:00 - 02:00',
      location: 'Distrito Financiero',
      highlights: [
        'Más de 300 whiskys diferentes',
        'Catas dirigidas por expertos',
        'Ambiente exclusivo y elegante',
        'Maridajes con quesos premium'
      ]
    }
  ], []);

  const featuresData = useMemo(
    () => [
      { key: 'Recetas', title: 'Recetas', desc: 'Encuentra cócteles por nombre o ingrediente.', icon: 'wine' },
      { key: 'Mapa', title: 'Mapa', desc: 'Bares y licorerías cerca tuyo.', icon: 'map' },
      { key: 'Favoritos', title: 'Favoritos', desc: 'Guarda bebidas y lugares.', icon: 'heart' },
      { key: 'Sube tu trago', title: 'Sube tu trago', desc: 'Comparte tus propias recetas con la comunidad.', icon: 'add-circle' },
      { key: 'Empresas', title: 'Empresas', desc: 'Descubre establecimientos aliados destacados cerca de ti.', icon: 'business' },
      { key: 'Cupones', title: 'Cupones', desc: 'Aprovecha descuentos y promociones exclusivas.', icon: 'pricetag' },
    ],
    []
  );

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
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Math.max(30, height * 0.04)
        }}
        showsVerticalScrollIndicator={false}
      >
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
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={handleSearchSubmit}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {isSearching ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleSearchSubmit}
                  disabled={!searchQuery.trim()}
                >
                  <Ionicons
                    name="search"
                    size={20}
                    color={searchQuery.trim() ? colors.primary : "#9CA3AF"}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.ctaRow}>
              <Pressable style={[styles.cta, styles.ctaPrimary]} onPress={() => navigation.navigate('AuthManager')}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="person" size={18} color="#fff" />
                  <Text style={styles.ctaPrimaryText}>Soy Usuario</Text>
                </View>
              </Pressable>
            </View>

            {/* Enlace discreto para empresas */}
            <View style={styles.empresaLinkContainer}>
              <Text style={styles.empresaLinkText}>¿Eres una empresa? </Text>
              <Pressable onPress={() => navigation.navigate('EmpresaAuthManager')}>
                <Text style={styles.empresaLink}>Regístrate aquí</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>¿Qué ofrece DrinkGo?</Text>
          <View style={styles.features}>
            {featuresData.map((f) => (
              <Pressable
                key={f.key}
                style={[
                  styles.featureCard,
                  activeFeature === f.key && styles.featureCardActive,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() => toggleFeature(f.key)}
                onHoverIn={() => toggleFeature(f.key)}
                onHoverOut={() => {
                  if (activeFeature === f.key) toggleFeature(f.key);
                }}
              >
                <Text
                  numberOfLines={f.key === 'Sube tu trago' ? 2 : 1}
                  adjustsFontSizeToFit
                  style={[styles.featureTitle, { color: colors.primary }]}
                >
                  {f.title}
                </Text>
                <Ionicons name={f.icon as any} size={18} color={colors.primary} style={styles.featureIcon} />
                {activeFeature === f.key && (
                  <Text style={[styles.featureText, { color: colors.muted }]}>{f.desc}</Text>
                )}
              </Pressable>
            ))}
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
          {/*<Pressable style={[styles.cta, styles.ctaOutline]} onPress={handleOpenCatalog}>
          <Text style={styles.ctaOutlineText}>Ver más en TheCocktailDB</Text>
        </Pressable>*/}
        </View>

        {/* Sección de empresas mejorada */}
        <View style={styles.companiesSection}>
          {/* Header con gradiente */}
          <View style={styles.companiesHeader}>
            <View style={styles.companiesHeaderContent}>
              <Ionicons name="business" size={28} color={colors.primary} />
              <View style={styles.companiesHeaderText}>
                <Text style={styles.companiesTitle}>Empresas que nos acompañan</Text>
                <Text style={styles.companiesSubtitle}>
                  Los mejores establecimientos de la ciudad
                </Text>
              </View>
            </View>
          </View>

          {/* Grid de empresas mejorado */}
          <View style={styles.companiesContainer}>
            {companiesData.map((company, index) => (
              <TouchableOpacity
                key={company.id}
                style={styles.companyCardNew}
                onPress={() => handleCompanyPress(company)}
                activeOpacity={0.9}
              >
                {/* Badge de destacado */}
                <View style={styles.featuredBadge}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={styles.featuredText}>Destacado</Text>
                </View>

                {/* Logo con efecto */}
                <View style={styles.companyLogoContainer}>
                  <View style={styles.companyLogoBackground}>
                    <Image
                      source={company.logo}
                      style={styles.companyLogoNew}
                      resizeMode="contain"
                    />
                  </View>
                </View>

                {/* Información de la empresa */}
                <View style={styles.companyInfo}>
                  <Text style={styles.companyNameNew}>{company.name}</Text>
                  <Text style={styles.companyTypeNew}>{company.type}</Text>

                  {/* Especialidades como tags */}
                  <View style={styles.specialtiesPreview}>
                    {company.specialties.slice(0, 2).map((specialty, idx) => (
                      <View key={idx} style={styles.specialtyTag}>
                        <Text style={styles.specialtyTagText}>{specialty}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Rating simulado */}
                  <View style={styles.ratingContainer}>
                    <View style={styles.stars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name="star"
                          size={12}
                          color="#FFD700"
                        />
                      ))}
                    </View>
                    <Text style={styles.ratingText}>4.8 • 120+ reseñas</Text>
                  </View>
                </View>

                {/* Botón de acción */}
                <View style={styles.companyAction}>
                  <Text style={styles.actionText}>Ver más</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tarjeta ejecutiva para propietarios */}
          <View style={[styles.featureCard, { backgroundColor: colors.primary, padding: 16, borderRadius: 12, marginVertical: 16 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: 8, marginRight: 12 }}>
                <Ionicons name="business" size={24} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>¿Eres propietario?</Text>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 4 }}>
                  Únete a nuestra red de establecimientos premium
                </Text>
              </View>
            </View>
            <Pressable
              style={{
                backgroundColor: 'white',
                borderRadius: 8,
                paddingVertical: 10,
                alignItems: 'center',
                marginTop: 8
              }}
              onPress={() => navigation.navigate('AuthOptions')}
            >
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Registrarse</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.background} />
            </Pressable>
          </View>
        </View>


      </ScrollView>

      {/* Modal de información de empresa */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCompany && (
              <>
                {/* Header del modal */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Ionicons name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>

                {/* Logo grande */}
                <View style={styles.modalLogoContainer}>
                  <Image
                    source={selectedCompany.logo}
                    style={styles.modalLogo}
                    resizeMode="contain"
                  />
                </View>

                {/* Información de la empresa */}
                <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalCompanyName}>{selectedCompany.name}</Text>
                  <Text style={styles.modalCompanyType}>{selectedCompany.type}</Text>

                  <Text style={styles.modalDescription}>{selectedCompany.description}</Text>

                  {/* Especialidades */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Especialidades</Text>
                    <View style={styles.specialtiesPreview}>
                      {selectedCompany.specialties.map((specialty: string, index: number) => (
                        <View key={index} style={styles.specialtyTag}>
                          <Text style={styles.specialtyTagText}>{specialty}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Información adicional */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Información</Text>
                    <View style={styles.infoItem}>
                      <Ionicons name="time" size={16} color={colors.primary} />
                      <Text style={styles.infoText}>{selectedCompany.hours}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Ionicons name="location" size={16} color={colors.primary} />
                      <Text style={styles.infoText}>{selectedCompany.location}</Text>
                    </View>
                  </View>

                  {/* Destacados */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Lo que nos destaca</Text>
                    {selectedCompany.highlights.map((highlight: string, index: number) => (
                      <View key={index} style={styles.highlightItem}>
                        <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                        <Text style={styles.highlightText}>{highlight}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Botón de acción */}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      closeModal();
                      navigation.navigate('GuestTabs', { screen: 'Mapa' });
                    }}
                  >
                    <Ionicons name="map" size={20} color={colors.background} />
                    <Text style={styles.actionButtonText}>Ver en el Mapa</Text>
                  </TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de resultados de búsqueda */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={searchModalVisible}
        onRequestClose={closeSearchModal}
      >
        <View style={styles.searchModalOverlay}>
          <View style={styles.searchModalContent}>
            {/* Header del modal */}
            <View style={styles.searchModalHeader}>
              <Text style={styles.searchModalTitle}>
                Resultados para "{searchQuery}"
              </Text>
              <TouchableOpacity style={styles.closeSearchButton} onPress={closeSearchModal}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Contador de resultados */}
            <Text style={styles.searchResultsCount}>
              {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
            </Text>



            {/* Lista de resultados */}
            <ScrollView
              style={styles.searchModalScroll}
              showsVerticalScrollIndicator={false}
            >
              {searchResults.map((drink) => (
                <TouchableOpacity
                  key={drink.idDrink}
                  style={styles.searchModalCard}
                  onPress={() => handlePressDrink(drink)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: drink.strDrinkThumb }}
                    style={styles.searchModalImage}
                    resizeMode="cover"
                  />
                  <View style={styles.searchModalInfo}>
                    <Text style={styles.searchModalDrinkName}>
                      {drink.strDrink}
                    </Text>
                    <Text style={styles.searchModalDrinkCategory}>
                      {drink.strCategory || 'Cóctel'} • {drink.strAlcoholic || 'Bebida'}
                    </Text>
                    {drink.strGlass && (
                      <Text style={styles.searchModalDrinkGlass}>
                        🥛 {drink.strGlass}
                      </Text>
                    )}
                    {drink.strIngredient1 && (
                      <Text style={styles.searchModalDrinkIngredients} numberOfLines={1}>
                        🧪 {drink.strIngredient1}{drink.strIngredient2 ? `, ${drink.strIngredient2}` : ''}{drink.strIngredient3 ? `, ${drink.strIngredient3}` : ''}...
                      </Text>
                    )}
                  </View>
                  <View style={styles.searchModalAction}>
                    <Text style={styles.searchModalActionText}>Ver receta</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Botón para nueva búsqueda */}
            <TouchableOpacity
              style={styles.newSearchButton}
              onPress={closeSearchModal}
            >
              <Ionicons name="search" size={16} color={colors.primary} />
              <Text style={styles.newSearchText}>Nueva búsqueda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    height: Math.max(380, height * 0.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    resizeMode: 'cover'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroContent: {
    width: '100%',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(20, height * 0.025),
    alignItems: 'center',
  },
  brand: {
    color: '#fff',
    fontSize: Math.min(36, width * 0.09),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    color: '#fff',
    fontSize: Math.min(16, width * 0.04),
    marginTop: 6,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  searchBar: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    color: '#111',
    fontSize: Math.min(16, width * 0.04),
  },
  searchButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  cta: {
    paddingVertical: Math.max(14, height * 0.018),
    paddingHorizontal: Math.max(32, width * 0.08),
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  ctaPrimary: {
    backgroundColor: colors.primary,
  },
  empresaLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  empresaLinkText: {
    fontSize: Math.min(14, width * 0.035),
    color: 'rgba(255,255,255,0.8)',
  },
  empresaLink: {
    fontSize: Math.min(14, width * 0.035),
    color: colors.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  ctaPrimaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: Math.min(14, width * 0.035),
  },
  ctaGhost: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ctaGhostText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: Math.min(14, width * 0.035),
  },
  ctaOutline: { borderWidth: 1, borderColor: colors.primary, backgroundColor: 'transparent', marginTop: 12 },
  ctaOutlineText: { color: colors.primary, fontWeight: '700' },

  section: { paddingHorizontal: 16, paddingVertical: 18 },
  sectionCard: {
    marginHorizontal: Math.max(16, width * 0.04),
    marginTop: 24,
    padding: Math.max(20, width * 0.05),
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: Math.min(22, width * 0.055),
    fontWeight: '800',
    marginBottom: 12,
    color: colors.primary,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: Math.min(15, width * 0.038),
    color: colors.muted,
    marginBottom: 20,
    lineHeight: 22,
    textAlign: 'center',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Math.max(10, width * 0.025),
    justifyContent: 'space-between',
  },
  featureCard: {
    flexBasis: '48%',
    borderRadius: 16,
    padding: Math.max(16, width * 0.04),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    minHeight: 120,
    alignItems: 'flex-start',
  },
  featureCardActive: {
    minHeight: 160,
    borderColor: colors.primary,
  },
  featureTitle: {
    fontWeight: '700',
    marginBottom: 8,
    fontSize: Math.min(17, width * 0.042),
  },
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  featureIcon: {
    marginRight: 4,
  },
  featureText: {
    fontSize: Math.min(14, width * 0.036),
    lineHeight: 20,
  },

  // Sección de empresas mejorada
  companiesSection: {
    marginHorizontal: Math.max(16, width * 0.04),
    marginTop: 24,
    backgroundColor: colors.background,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  companiesHeader: {
    backgroundColor: `${colors.primary}15`,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  companiesHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  companiesHeaderText: {
    flex: 1,
  },
  companiesTitle: {
    fontSize: Math.min(22, width * 0.055),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  companiesSubtitle: {
    fontSize: Math.min(16, width * 0.04),
    color: colors.muted,
    lineHeight: 22,
  },
  companiesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  companyCardNew: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  featuredText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#B8860B',
  },
  companyLogoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  companyLogoBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  companyLogoNew: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  companyInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  companyNameNew: {
    fontSize: Math.min(15, width * 0.038),
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  companyTypeNew: {
    fontSize: Math.min(12, width * 0.03),
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 8,
  },
  specialtiesPreview: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  specialtyTag: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  specialtyTagText: {
    fontSize: 8,
    color: colors.primary,
    fontWeight: '600',
  },
  ratingContainer: {
    alignItems: 'center',
    gap: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingText: {
    fontSize: 9,
    color: colors.muted,
    fontWeight: '500',
  },
  companyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: `${colors.primary}08`,
    borderRadius: 8,
    gap: 4,
  },
  actionText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  businessCtaNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}08`,
    margin: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
    gap: 12,
  },
  ctaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: Math.min(16, width * 0.04),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  ctaDescription: {
    fontSize: Math.min(12, width * 0.03),
    color: colors.muted,
    lineHeight: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  ctaButtonText: {
    fontSize: Math.min(12, width * 0.03),
    fontWeight: 'bold',
    color: colors.background,
  },



  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 20,
    width: Math.min(width * 0.9, 400),
    maxHeight: height * 0.8,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 0,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  modalLogoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalLogo: {
    width: Math.max(120, width * 0.3),
    height: Math.max(120, width * 0.3),
    borderRadius: 16,
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalCompanyName: {
    fontSize: Math.min(24, width * 0.06),
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalCompanyType: {
    fontSize: Math.min(16, width * 0.04),
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: Math.min(15, width * 0.038),
    color: colors.text,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: Math.min(18, width * 0.045),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: Math.min(14, width * 0.035),
    color: colors.text,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: Math.min(14, width * 0.035),
    color: colors.text,
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 10,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: Math.min(16, width * 0.04),
    fontWeight: 'bold',
    color: colors.background,
  },

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
  carouselContent: {
    gap: Math.max(12, width * 0.03),
    paddingHorizontal: 4,
  },
  slide: {
    width: Math.max(240, width * 0.7),
    marginRight: Math.max(12, width * 0.03),
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  slideImage: {
    width: '100%',
    height: Math.max(120, height * 0.15),
    borderRadius: 12,
    marginBottom: 8,
  },
  slideTitle: {
    marginTop: 8,
    fontWeight: '700',
    color: colors.primary,
    fontSize: Math.min(16, width * 0.04),
  },
  slideDesc: {
    color: colors.muted,
    fontSize: Math.min(13, width * 0.032),
    lineHeight: 18,
    marginTop: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
    borderRadius: 5,
  },



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



  // Estilos del modal de búsqueda
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  searchModalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.8,
    paddingBottom: 20,
  },
  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
  },
  closeSearchButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  searchResultsCount: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: colors.surface,
  },
  searchModalScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchModalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  searchModalImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  searchModalInfo: {
    flex: 1,
  },
  searchModalDrinkName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  searchModalDrinkCategory: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 2,
  },
  searchModalDrinkType: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  searchModalDrinkGlass: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 2,
  },
  searchModalDrinkIngredients: {
    fontSize: 11,
    color: colors.text,
    fontStyle: 'italic',
  },
  searchModalAction: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  searchModalActionText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  newSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.primary,
    gap: 8,
  },
  newSearchText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
});


