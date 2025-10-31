import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, sizes } from '../../utils';
import Login from './Login';
import Registro from './Registro';

type AuthMode = 'welcome' | 'login' | 'register';

interface Props {
  onAuthSuccess: (user: any) => void;
  onCancel: () => void;
}

export default function AuthManager({ onAuthSuccess, onCancel }: Props) {
  const [mode, setMode] = useState<AuthMode>('welcome');

  if (mode === 'login') {
    return (
      <Login
        onLoginSuccess={onAuthSuccess}
        onNavigateToRegister={() => setMode('register')}
        onCancel={() => setMode('welcome')}
      />
    );
  }

  if (mode === 'register') {
    return (
      <Registro
        onRegistroSuccess={onAuthSuccess}
        onNavigateToLogin={() => setMode('login')}
        onCancel={() => setMode('welcome')}
      />
    );
  }

  // Pantalla de bienvenida
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onCancel}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DrinkMate</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Logo/Icono principal */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="wine" size={80} color={colors.primary} />
          </View>
          <Text style={styles.appTitle}>DrinkMate</Text>
          <Text style={styles.appSubtitle}>
            Descubre los mejores bares, obtén cupones exclusivos y disfruta de promociones únicas
          </Text>
        </View>

        {/* Beneficios */}
        <View style={styles.benefitsSection}>
          <View style={styles.benefitItem}>
            <Ionicons name="pricetag" size={24} color={colors.primary} />
            <Text style={styles.benefitText}>Cupones y descuentos exclusivos</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="notifications" size={24} color={colors.primary} />
            <Text style={styles.benefitText}>Notificaciones de promociones</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="heart" size={24} color={colors.primary} />
            <Text style={styles.benefitText}>Guarda tus lugares favoritos</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="map" size={24} color={colors.primary} />
            <Text style={styles.benefitText}>Encuentra bares cerca de ti</Text>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => setMode('register')}
          >
            <Ionicons name="person-add" size={20} color={colors.background} />
            <Text style={styles.registerButtonText}>Crear Cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => setMode('login')}
          >
            <Ionicons name="log-in" size={20} color={colors.primary} />
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Opción de continuar sin cuenta */}
        <View style={styles.guestSection}>
          <Text style={styles.guestText}>¿Solo quieres echar un vistazo?</Text>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.guestLink}>Continuar sin cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: Math.max(16, width * 0.04),
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: sizes.margin.xlarge,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.margin.large,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  appTitle: {
    fontSize: sizes.xlarge * 1.2,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.margin.medium,
  },
  appSubtitle: {
    fontSize: sizes.medium,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: sizes.padding.medium,
  },
  benefitsSection: {
    marginBottom: sizes.margin.xlarge,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sizes.padding.medium,
    paddingHorizontal: sizes.padding.medium,
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.medium,
    marginBottom: sizes.margin.medium,
    gap: sizes.margin.medium,
  },
  benefitText: {
    fontSize: sizes.medium,
    color: colors.text,
    flex: 1,
  },
  actionButtons: {
    gap: sizes.margin.medium,
    marginBottom: sizes.margin.xlarge,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    gap: sizes.margin.small,
  },
  registerButtonText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.background,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    gap: sizes.margin.small,
  },
  loginButtonText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.primary,
  },
  guestSection: {
    alignItems: 'center',
    gap: sizes.margin.small,
  },
  guestText: {
    fontSize: sizes.medium,
    color: colors.muted,
  },
  guestLink: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.primary,
  },
});