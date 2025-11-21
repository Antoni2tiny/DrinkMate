import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, sizes } from '../../utils';
import { sendTestNotification, registerForPushNotificationsAsync } from '../../utils/notifications';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { FirestoreCuponService, FirestoreEmpresaService } from '../../utils/firebaseServices';
import { Cupon } from '../../utils/models';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../../utils/initFirebase';

import Constants from 'expo-constants';

const db = firebaseApp ? getFirestore(firebaseApp) : null;
import { useAppAuth } from '../hooks/useAppAuth';
import SmartHeader from '../components/SmartHeader';

interface DrinkItem {
  id: string;
  name: string;
  image: string;
  date: string;
}

interface Props {
  onNavigateToAuth?: () => void;
  onNavigateToEmpresaAuth?: () => void;
}

export default function HomeUsuario({ onNavigateToAuth, onNavigateToEmpresaAuth }: Props) {
  type RootStackParamList = {
    Home: undefined;
    AuthOptions: undefined;
    WelcomeHome: undefined;
    Login: undefined;
    Register: undefined;
    UserTypeSelection: undefined;
    GuestTabs: undefined;
    UserTabs: undefined;
    EmpresaTabs: undefined;
    Main: undefined;
    DetalleReceta: undefined;
    AuthManager: undefined;
    EmpresaAuthManager: undefined;
    RegistroEmpresa: undefined;
  };

  type BottomTabParamList = {
    Inicio: undefined;
    Empresa: undefined;
    Home: undefined;
    Mapa: undefined;
    Favoritos: undefined;
    Subir: undefined;
  };

  type HomeUsuarioNavProp = CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabParamList, 'Inicio'>,
    NativeStackNavigationProp<RootStackParamList>
  >;

  const navigation = useNavigation<HomeUsuarioNavProp>();
  const { userType, currentUser, isAuthenticated } = useAppAuth();
  const [recentDrinks, setRecentDrinks] = useState<DrinkItem[]>([]);
  const [cupones, setCupones] = useState<Cupon[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loadingCupones, setLoadingCupones] = useState(true);

  useEffect(() => {
    loadRecentDrinks();
    loadCuponesFromFirebase();
    loadEmpresasFromFirebase();
  }, []);

  /**
   * Cargar cupones activos desde Firebase
   */
  const loadCuponesFromFirebase = async () => {
    try {
      setLoadingCupones(true);
      
      // Método simplificado: obtener todos los cupones directamente
      try {
        if (!db) {
          throw new Error('Firestore no disponible');
        }
        const q = query(collection(db, 'cupones'));
        const querySnapshot = await getDocs(q);
        const todosCupones: Cupon[] = [];
        
        querySnapshot.forEach((doc) => {
          todosCupones.push({
            id: doc.id,
            ...doc.data()
          } as Cupon);
        });
        
        // Filtrar solo cupones activos y no vencidos
        const cuponesActivos = todosCupones.filter(cupon => {
          const hoy = new Date().toISOString().split('T')[0];
          return cupon.activo && cupon.fechaVencimiento >= hoy;
        });
        
        setCupones(cuponesActivos);
      } catch (firestoreError) {
        // Usar cupones de ejemplo como fallback
        const { cuponesEjemplo } = await import('../../utils/models');
        setCupones(cuponesEjemplo || []);
      }
    } catch (error) {
      console.error('❌ Error cargando cupones:', error);
      setCupones([]);
    } finally {
      setLoadingCupones(false);
    }
  };

  /**
   * Cargar empresas desde Firebase
   */
  const loadEmpresasFromFirebase = async () => {
    try {
      const empresasActivas = await FirestoreEmpresaService.getEmpresasActivas();
      setEmpresas(empresasActivas);
    } catch (error) {
      console.error('❌ Error cargando empresas:', error);
      setEmpresas([]);
    }
  };

  /**
   * Carga los tragos recientes del usuario (simulado)
   */
  const loadRecentDrinks = () => {
    try {
      // Datos simulados - en una app real vendría de una API o base de datos
      const mockDrinks: DrinkItem[] = [
        {
          id: '1',
          name: 'Margarita Clásica',
          image: 'https://via.placeholder.com/50x50/6C2BD9/FFFFFF?text=M',
          date: '2025-10-27',
        },
        {
          id: '2',
          name: 'Negroni',
          image: 'https://via.placeholder.com/50x50/FF6B6B/FFFFFF?text=N',
          date: '2025-10-26',
        },
        {
          id: '3',
          name: 'Old Fashioned',
          image: 'https://via.placeholder.com/50x50/10B981/FFFFFF?text=O',
          date: '2025-10-25',
        },
      ];
      setRecentDrinks(mockDrinks);
    } catch (error) {
      console.error('Error cargando tragos recientes:', error);
      Alert.alert('Error', 'No se pudieron cargar los tragos recientes.');
    }
  };

  /**
   * Maneja el envío de notificación de prueba
   */
  const handleTestNotification = async () => {
    try {
      await sendTestNotification(
        '¡Hola desde DrinkMate!',
        'Esta es una notificación de prueba. ¡Todo funciona correctamente!'
      );
      Alert.alert('Éxito', 'Notificación de prueba enviada correctamente.');
    } catch (error) {
      console.error('Error enviando notificación de prueba:', error);
      Alert.alert('Error', 'No se pudo enviar la notificación de prueba.');
    }
  };

  /**
   * Navega a diferentes pantallas
   */
  type ScreenName = keyof RootStackParamList | keyof BottomTabParamList;
  const navigateToScreen = (screenName: ScreenName) => {
    try {
      if (screenName === 'RegistroEmpresa') {
        // Usar el callback para mostrar el gestor de empresas
        if (onNavigateToEmpresaAuth) {
          onNavigateToEmpresaAuth();
        } else {
          navigation.navigate('EmpresaAuthManager');
        }
      } else {
        navigation.navigate(screenName);
      }
    } catch (error) {
      console.error('Error navegando a pantalla:', error);
      Alert.alert('Error', 'No se pudo navegar a la pantalla solicitada.');
    }
  };

  /**
   * Renderiza un item de trago reciente
   */
  const renderDrinkItem = ({ item }: { item: DrinkItem }) => (
    <TouchableOpacity style={styles.drinkItem}>
      <Image source={{ uri: item.image }} style={styles.drinkImage} />
      <View style={styles.drinkInfo}>
        <Text style={styles.drinkName}>{item.name}</Text>
        <Text style={styles.drinkDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header inteligente */}
        <SmartHeader
          onAuthPress={onNavigateToAuth}
          onEmpresaAuthPress={onNavigateToEmpresaAuth}
        />

        {/* Acciones rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigateToScreen('Subir')}
            >
              <Ionicons name="add-circle" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Subir Trago</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigateToScreen('Mapa')}
            >
              <Ionicons name="map" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Ver Mapa</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigateToScreen('Favoritos')}
            >
              <Ionicons name="heart" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Favoritos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cupones Disponibles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cupones Disponibles</Text>
            <TouchableOpacity onPress={loadCuponesFromFirebase}>
              <Ionicons name="refresh" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {loadingCupones ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando cupones...</Text>
            </View>
          ) : cupones.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cuponesScroll}>
              {cupones.map((cupon) => (
                <TouchableOpacity key={cupon.id} style={styles.cuponCard}>
                  <View style={styles.cuponHeader}>
                    <Text style={styles.cuponTitulo}>{cupon.titulo}</Text>
                    <View style={styles.cuponDescuento}>
                      <Text style={styles.cuponDescuentoText}>
                        {cupon.tipoDescuento === 'porcentaje' ? `${cupon.valorDescuento}%` :
                         cupon.tipoDescuento === 'monto_fijo' ? `$${cupon.valorDescuento}` :
                         'Promo'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cuponDescripcion} numberOfLines={2}>
                    {cupon.descripcion}
                  </Text>
                  <View style={styles.cuponFooter}>
                    <Text style={styles.cuponVencimiento}>
                      Hasta {cupon.fechaVencimiento}
                    </Text>
                    {cupon.codigoCupon && (
                      <Text style={styles.cuponCodigo}>{cupon.codigoCupon}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyCupones}>
              <Ionicons name="pricetag-outline" size={48} color={colors.muted} />
              <Text style={styles.emptyCuponesText}>No hay cupones disponibles</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={loadCuponesFromFirebase}>
                <Text style={styles.refreshButtonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Empresas Aliadas */}
        {empresas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nuestras Empresas Aliadas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.empresasScroll}>
              {empresas.map((empresa) => (
                <TouchableOpacity key={empresa.id} style={styles.empresaCard}>
                  <View style={styles.empresaLogo}>
                    {empresa.logo ? (
                      <Image source={{ uri: empresa.logo }} style={styles.empresaLogoImage} />
                    ) : (
                      <Ionicons name="business" size={32} color={colors.primary} />
                    )}
                  </View>
                  <Text style={styles.empresaNombre} numberOfLines={1}>{empresa.nombre}</Text>
                  <Text style={styles.empresaTipo} numberOfLines={1}>{empresa.tipo || 'Empresa'}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Botón de prueba de notificación */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.testButton} onPress={handleTestNotification}>
            <Ionicons name="notifications-outline" size={20} color={colors.darkText} />
            <Text style={styles.testButtonText}>Probar Notificación Local</Text>
          </TouchableOpacity>
        </View>

        {/* Tragos recientes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tragos Recientes</Text>
          {recentDrinks.length > 0 ? (
            <FlatList
              data={recentDrinks}
              renderItem={renderDrinkItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={styles.drinksList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="wine-outline" size={48} color={colors.muted} />
              <Text style={styles.emptyText}>No hay tragos recientes</Text>
              <Text style={styles.emptySubtext}>¡Sube tu primer trago!</Text>
            </View>
          )}
        </View>

        {/* Estado de notificaciones -- ELIMINADO */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado de Notificaciones</Text>
          <View style={styles.statusCard}>
            <Ionicons
              name={pushToken ? "checkmark-circle" : "alert-circle"}
              size={20}
              color={pushToken ? colors.success : colors.warning}
            />
            <Text style={styles.statusText}>
              {pushToken ? 'Notificaciones configuradas' : 'Configurando notificaciones...'}
            </Text>
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBackground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: sizes.padding.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: sizes.padding.large,
    backgroundColor: colors.darkSurface,
    marginBottom: sizes.margin.medium,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: sizes.margin.medium,
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: sizes.medium,
    color: colors.muted,
  },
  userName: {
    fontSize: sizes.large,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  authLink: {
    fontSize: sizes.small,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  notificationButton: {
    padding: sizes.padding.small,
    borderRadius: sizes.borderRadius.medium,
    backgroundColor: colors.primary,
  },
  section: {
    marginHorizontal: Math.max(12, width * 0.03), // Margen adaptativo
    marginBottom: sizes.margin.large,
  },
  sectionTitle: {
    fontSize: sizes.large,
    fontWeight: 'bold',
    color: colors.darkText,
    marginBottom: sizes.margin.medium,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.darkSurface,
    borderRadius: sizes.borderRadius.medium,
    paddingVertical: sizes.padding.large,
  },
  featuresList: {
    gap: sizes.margin.small,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    fontSize: sizes.small,
    color: colors.darkText,
    marginTop: sizes.margin.small,
    textAlign: 'center',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    gap: sizes.margin.small,
  },
  testButtonText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  drinksList: {
    backgroundColor: colors.darkSurface,
    borderRadius: sizes.borderRadius.medium,
    padding: sizes.padding.small,
  },
  drinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sizes.padding.medium,
    paddingHorizontal: sizes.padding.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  drinkImage: {
    width: 50,
    height: 50,
    borderRadius: sizes.borderRadius.small,
    marginRight: sizes.margin.medium,
  },
  drinkInfo: {
    flex: 1,
  },
  drinkName: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  drinkDate: {
    fontSize: sizes.small,
    color: colors.muted,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: sizes.padding.xlarge,
    backgroundColor: colors.darkSurface,
    borderRadius: sizes.borderRadius.medium,
  },
  emptyText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.darkText,
    marginTop: sizes.margin.medium,
  },
  emptySubtext: {
    fontSize: sizes.small,
    color: colors.muted,
    marginTop: sizes.margin.small,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkSurface,
    padding: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    gap: sizes.margin.small,
  },
  statusText: {
    fontSize: sizes.medium,
    color: colors.darkText,
  },
  // Estilos para cupones
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.margin.medium,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: sizes.padding.large,
  },
  loadingText: {
    fontSize: sizes.medium,
    color: colors.muted,
  },
  cuponesScroll: {
    marginHorizontal: -sizes.margin.medium,
    paddingHorizontal: sizes.margin.medium,
  },
  cuponCard: {
    width: 280,
    backgroundColor: colors.darkSurface,
    borderRadius: sizes.borderRadius.medium,
    padding: sizes.padding.medium,
    marginRight: sizes.margin.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cuponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: sizes.margin.small,
  },
  cuponTitulo: {
    fontSize: sizes.large,
    fontWeight: 'bold',
    color: colors.darkText,
    flex: 1,
    marginRight: sizes.margin.small,
  },
  cuponDescuento: {
    backgroundColor: colors.primary,
    paddingHorizontal: sizes.padding.small,
    paddingVertical: 4,
    borderRadius: sizes.borderRadius.small,
  },
  cuponDescuentoText: {
    fontSize: sizes.small,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  cuponDescripcion: {
    fontSize: sizes.medium,
    color: colors.muted,
    marginBottom: sizes.margin.medium,
    lineHeight: 20,
  },
  cuponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cuponVencimiento: {
    fontSize: sizes.small,
    color: colors.muted,
  },
  cuponCodigo: {
    fontSize: sizes.small,
    fontWeight: 'bold',
    color: colors.primary,
    backgroundColor: colors.darkBackground,
    paddingHorizontal: sizes.padding.small,
    paddingVertical: 2,
    borderRadius: sizes.borderRadius.small,
  },
  emptyCupones: {
    alignItems: 'center',
    paddingVertical: sizes.padding.xlarge,
    backgroundColor: colors.darkSurface,
    borderRadius: sizes.borderRadius.medium,
  },
  emptyCuponesText: {
    fontSize: sizes.medium,
    color: colors.muted,
    marginTop: sizes.margin.medium,
    marginBottom: sizes.margin.medium,
  },
  refreshButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: sizes.padding.medium,
    paddingVertical: sizes.padding.small,
    borderRadius: sizes.borderRadius.small,
  },
  refreshButtonText: {
    fontSize: sizes.small,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  // Estilos para empresas
  empresasScroll: {
    marginHorizontal: -sizes.margin.medium,
    paddingHorizontal: sizes.margin.medium,
  },
  empresaCard: {
    width: 120,
    alignItems: 'center',
    backgroundColor: colors.darkSurface,
    borderRadius: sizes.borderRadius.medium,
    padding: sizes.padding.medium,
    marginRight: sizes.margin.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  empresaLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.darkBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.margin.small,
  },
  empresaLogoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  empresaNombre: {
    fontSize: sizes.small,
    fontWeight: 'bold',
    color: colors.darkText,
    textAlign: 'center',
    marginBottom: 2,
  },
  empresaTipo: {
    fontSize: sizes.small,
    color: colors.muted,
    textAlign: 'center',
  },
});