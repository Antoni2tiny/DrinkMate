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

const { width, height } = Dimensions.get('window');

export default function WelcomeHome() {
  const navigation = useNavigation();

  /**
   * Navega a la pantalla de login
   */
  const goToLogin = () => {
    navigation.navigate('Login');
  };

  /**
   * Navega a la pantalla de registro
   */
  const goToRegister = () => {
    navigation.navigate('Register');
  };

  /**
   * Navega como invitado (sin login)
   */
  const continueAsGuest = () => {
    navigation.navigate('GuestTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="wine" size={64} color={colors.primary} />
          </View>
          <Text style={styles.appTitle}>DrinkMate</Text>
          <Text style={styles.appSubtitle}>
            Descubre, comparte y disfruta los mejores tragos
          </Text>
        </View>

        {/* Características principales */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>¿Qué puedes hacer?</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="search" size={24} color={colors.primary} />
              <Text style={styles.featureText}>Explora miles de recetas de tragos</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="heart" size={24} color={colors.accent} />
              <Text style={styles.featureText}>Guarda tus favoritos</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="camera" size={24} color={colors.success} />
              <Text style={styles.featureText}>Comparte tus propias creaciones</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="map" size={24} color={colors.warning} />
              <Text style={styles.featureText}>Encuentra bares cerca de ti</Text>
            </View>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.primaryButton} onPress={goToLogin}>
            <Ionicons name="log-in" size={20} color={colors.background} />
            <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={goToRegister}>
            <Ionicons name="person-add" size={20} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestButton} onPress={continueAsGuest}>
            <Text style={styles.guestButtonText}>Continuar como invitado</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Al continuar, aceptas nuestros términos y condiciones
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(20, height * 0.03),
  },
  header: {
    alignItems: 'center',
    marginBottom: Math.max(40, height * 0.05),
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.margin.large,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  appTitle: {
    fontSize: Math.min(36, width * 0.09),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: sizes.margin.small,
  },
  appSubtitle: {
    fontSize: Math.min(18, width * 0.045),
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: sizes.padding.medium,
  },
  featuresSection: {
    marginBottom: Math.max(40, height * 0.05),
  },
  featuresTitle: {
    fontSize: Math.min(24, width * 0.06),
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: sizes.margin.large,
  },
  featuresList: {
    gap: sizes.margin.medium,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    gap: sizes.margin.medium,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  featureText: {
    fontSize: Math.min(16, width * 0.04),
    color: colors.text,
    flex: 1,
  },
  actionsSection: {
    gap: sizes.margin.medium,
    marginBottom: Math.max(30, height * 0.04),
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: Math.max(16, height * 0.02),
    borderRadius: sizes.borderRadius.medium,
    gap: sizes.margin.small,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  primaryButtonText: {
    fontSize: Math.min(18, width * 0.045),
    fontWeight: 'bold',
    color: colors.background,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: Math.max(16, height * 0.02),
    borderRadius: sizes.borderRadius.medium,
    gap: sizes.margin.small,
  },
  secondaryButtonText: {
    fontSize: Math.min(18, width * 0.045),
    fontWeight: 'bold',
    color: colors.primary,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: sizes.padding.medium,
  },
  guestButtonText: {
    fontSize: Math.min(16, width * 0.04),
    color: colors.muted,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: Math.min(12, width * 0.03),
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 16,
  },
});