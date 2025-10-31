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
import EmpresaLogin from './EmpresaLogin';
import RegistroEmpresa from './RegistroEmpresa';

type EmpresaAuthMode = 'welcome' | 'login' | 'register';

interface Props {
  onAuthSuccess: (user: any, empresa: any) => void;
  onCancel: () => void;
}

export default function EmpresaAuthManager({ onAuthSuccess, onCancel }: Props) {
  const [mode, setMode] = useState<EmpresaAuthMode>('welcome');

  if (mode === 'login') {
    return (
      <EmpresaLogin
        onLoginSuccess={onAuthSuccess}
        onNavigateToRegister={() => setMode('register')}
        onCancel={() => setMode('welcome')}
      />
    );
  }

  if (mode === 'register') {
    return (
      <RegistroEmpresa
        onEmpresaCreated={(empresa) => {
          console.log('✅ Empresa creada:', empresa);
          // Si se registró con cuenta, redirigir al login
          if (empresa.conCuenta) {
            setMode('login');
          } else {
            // Si es registro simple, mostrar éxito y volver
            onCancel();
          }
        }}
        onCancel={() => setMode('welcome')}
        withAuth={true} // Incluir campos de autenticación
      />
    );
  }

  // Pantalla de bienvenida para empresas
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onCancel}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DrinkMate Empresas</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Logo/Icono principal */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="business" size={80} color={colors.primary} />
          </View>
          <Text style={styles.appTitle}>Panel de Empresas</Text>
          <Text style={styles.appSubtitle}>
            Gestiona tu negocio, crea cupones exclusivos y conecta con más clientes
          </Text>
        </View>

        {/* Beneficios para empresas */}
        <View style={styles.benefitsSection}>
          <View style={styles.benefitItem}>
            <Ionicons name="pricetag" size={24} color={colors.primary} />
            <Text style={styles.benefitText}>Crea cupones y promociones</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="analytics" size={24} color={colors.primary} />
            <Text style={styles.benefitText}>Estadísticas de tu negocio</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="notifications" size={24} color={colors.primary} />
            <Text style={styles.benefitText}>Notifica a tus clientes</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="people" size={24} color={colors.primary} />
            <Text style={styles.benefitText}>Aumenta tu clientela</Text>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => setMode('register')}
          >
            <Ionicons name="business" size={20} color={colors.background} />
            <Text style={styles.registerButtonText}>Registrar Empresa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => setMode('login')}
          >
            <Ionicons name="log-in" size={20} color={colors.primary} />
            <Text style={styles.loginButtonText}>Acceso Empresas</Text>
          </TouchableOpacity>
        </View>

        {/* Información adicional */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark" size={20} color={colors.success} />
            <Text style={styles.infoText}>
              Registro gratuito. Comienza a gestionar tu negocio hoy mismo.
            </Text>
          </View>
        </View>

        {/* Opción de volver */}
        <View style={styles.backSection}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.backLink}>← Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: sizes.padding.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.darkSurface,
  },
  backButton: {
    padding: sizes.padding.small,
  },
  headerTitle: {
    fontSize: sizes.large,
    fontWeight: 'bold',
    color: colors.darkText,
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
    backgroundColor: colors.darkSurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.margin.large,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  appTitle: {
    fontSize: sizes.xlarge * 1.2,
    fontWeight: 'bold',
    color: colors.darkText,
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
    backgroundColor: colors.darkSurface,
    borderRadius: sizes.borderRadius.medium,
    marginBottom: sizes.margin.medium,
    gap: sizes.margin.medium,
  },
  benefitText: {
    fontSize: sizes.medium,
    color: colors.darkText,
    flex: 1,
  },
  actionButtons: {
    gap: sizes.margin.medium,
    marginBottom: sizes.margin.large,
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
    color: colors.darkText,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.darkSurface,
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
  infoSection: {
    marginBottom: sizes.margin.large,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.darkSurface,
    padding: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    gap: sizes.margin.small,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: sizes.small,
    color: colors.muted,
    lineHeight: 18,
  },
  backSection: {
    alignItems: 'center',
  },
  backLink: {
    fontSize: sizes.medium,
    color: colors.muted,
  },
});