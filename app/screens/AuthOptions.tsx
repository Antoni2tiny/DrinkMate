import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, sizes } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: { userType: 'usuario' | 'empresa' };
  Register: { userType: 'usuario' | 'empresa' };
  GuestTabs: undefined;
  // Add other screens and their params as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

export default function AuthOptions() {
  const navigation = useNavigation<NavigationProp>();

  /**
   * Navega al login con tipo de usuario específico
   */
  const goToLogin = (userType: 'usuario' | 'empresa') => {
    navigation.navigate('Login', { userType });
  };

  /**
   * Navega al registro con tipo de usuario específico
   */
  const goToRegister = (userType: 'usuario' | 'empresa') => {
    navigation.navigate('Register', { userType });
  };

  /**
   * Regresa al Home
   */
  const goBack = () => {
    navigation.goBack();
  };

  /**
   * Continúa como invitado
   */
  const continueAsGuest = () => {
    navigation.navigate('GuestTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Únete a DrinkMate</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo y descripción */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="wine" size={48} color={colors.primary} />
          </View>
          <Text style={styles.appTitle}>DrinkMate</Text>
          <Text style={styles.appDescription}>
            Elige cómo quieres unirte a nuestra comunidad
          </Text>
        </View>

        {/* Opciones para Usuarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Para Usuarios</Text>
          <Text style={styles.sectionDescription}>
            Explora recetas, guarda favoritos y comparte tus creaciones
          </Text>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => goToLogin('usuario')}
            >
              <Ionicons name="log-in" size={20} color={colors.background} />
              <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => goToRegister('usuario')}
            >
              <Ionicons name="person-add" size={20} color={colors.primary} />
              <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
            </TouchableOpacity>
          </View>

          {/* Características para usuarios */}
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="search" size={16} color={colors.success} />
              <Text style={styles.featureText}>Buscar miles de recetas</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="heart" size={16} color={colors.success} />
              <Text style={styles.featureText}>Guardar favoritos</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="camera" size={16} color={colors.success} />
              <Text style={styles.featureText}>Subir tus propios tragos</Text>
            </View>
          </View>
        </View>

        {/* Separador */}
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>o</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Opciones para Empresas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏢 Para Empresas</Text>
          <Text style={styles.sectionDescription}>
            Gestiona tu negocio y conecta con tus clientes
          </Text>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.empresaButton]}
              onPress={() => goToLogin('empresa')}
            >
              <Ionicons name="business" size={20} color={colors.background} />
              <Text style={styles.empresaButtonText}>Iniciar Sesión Empresa</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.empresaSecondaryButton]}
              onPress={() => goToRegister('empresa')}
            >
              <Ionicons name="add-circle" size={20} color={colors.accent} />
              <Text style={styles.empresaSecondaryButtonText}>Registrar Empresa</Text>
            </TouchableOpacity>
          </View>

          {/* Características para empresas */}
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="notifications" size={16} color={colors.warning} />
              <Text style={styles.featureText}>Enviar notificaciones a clientes</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="analytics" size={16} color={colors.warning} />
              <Text style={styles.featureText}>Panel de control empresarial</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="megaphone" size={16} color={colors.warning} />
              <Text style={styles.featureText}>Promocionar productos</Text>
            </View>
          </View>
        </View>

        {/* Opción de invitado */}
        <View style={styles.guestSection}>
          <TouchableOpacity style={styles.guestButton} onPress={continueAsGuest}>
            <Ionicons name="eye" size={20} color={colors.muted} />
            <Text style={styles.guestButtonText}>Explorar como invitado</Text>
          </TouchableOpacity>
          <Text style={styles.guestDescription}>
            Navega sin crear cuenta (funcionalidades limitadas)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: sizes.padding.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    padding: sizes.padding.small,
  },
  headerTitle: {
    fontSize: sizes.large,
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(20, height * 0.03),
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Math.max(32, height * 0.04),
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.margin.medium,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  appTitle: {
    fontSize: Math.min(28, width * 0.07),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: sizes.margin.small,
  },
  appDescription: {
    fontSize: Math.min(16, width * 0.04),
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.large,
    padding: Math.max(20, width * 0.05),
    marginBottom: sizes.margin.large,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: Math.min(20, width * 0.05),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.margin.small,
  },
  sectionDescription: {
    fontSize: Math.min(14, width * 0.035),
    color: colors.muted,
    marginBottom: sizes.margin.large,
    lineHeight: 20,
  },
  buttonGroup: {
    gap: sizes.margin.medium,
    marginBottom: sizes.margin.large,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(14, height * 0.018),
    borderRadius: sizes.borderRadius.medium,
    gap: sizes.margin.small,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  primaryButtonText: {
    fontSize: Math.min(16, width * 0.04),
    fontWeight: 'bold',
    color: colors.background,
  },
  secondaryButton: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    fontSize: Math.min(16, width * 0.04),
    fontWeight: 'bold',
    color: colors.primary,
  },
  empresaButton: {
    backgroundColor: colors.accent,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  empresaButtonText: {
    fontSize: Math.min(16, width * 0.04),
    fontWeight: 'bold',
    color: colors.background,
  },
  empresaSecondaryButton: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  empresaSecondaryButtonText: {
    fontSize: Math.min(16, width * 0.04),
    fontWeight: 'bold',
    color: colors.accent,
  },
  featuresList: {
    gap: sizes.margin.small,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.margin.small,
  },
  featureText: {
    fontSize: Math.min(14, width * 0.035),
    color: colors.text,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: sizes.margin.large,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  separatorText: {
    fontSize: Math.min(14, width * 0.035),
    color: colors.muted,
    marginHorizontal: sizes.margin.medium,
    fontWeight: '500',
  },
  guestSection: {
    alignItems: 'center',
    paddingVertical: sizes.padding.large,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.margin.small,
    paddingVertical: sizes.padding.medium,
    paddingHorizontal: sizes.padding.large,
    borderRadius: sizes.borderRadius.medium,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guestButtonText: {
    fontSize: Math.min(16, width * 0.04),
    color: colors.muted,
    fontWeight: '500',
  },
  guestDescription: {
    fontSize: Math.min(12, width * 0.03),
    color: colors.muted,
    textAlign: 'center',
    marginTop: sizes.margin.small,
  },
});