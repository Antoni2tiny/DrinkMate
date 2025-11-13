import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppAuth } from '../hooks/useAppAuth';
import { colors } from '../../utils';

// Importar componentes
import AuthenticatedApp from '../components/AuthenticatedApp';
import AuthManager from './AuthManager';
import EmpresaAuthManager from './EmpresaAuthManager';

/**
 * Ejemplo de cómo usar el sistema de autenticación integrado
 */
export default function AppExample() {
  const { userType, isLoading } = useAppAuth();
  const [showAuthType, setShowAuthType] = useState<'user' | 'empresa' | null>(null);

  // Mostrar pantallas de autenticación si es necesario
  if (showAuthType === 'user') {
    return (
      <AuthManager
        onAuthSuccess={() => setShowAuthType(null)}
        onCancel={() => setShowAuthType(null)}
      />
    );
  }

  if (showAuthType === 'empresa') {
    return (
      <EmpresaAuthManager
        onAuthSuccess={(user, empresa) => {
          console.log('✅ Usuario autenticado:', user);
          console.log('🏢 Empresa autenticada:', empresa);
          setShowAuthType(null);
        }}
        onCancel={() => setShowAuthType(null)}
      />
    );
  }

  // Usar el componente AuthenticatedApp que maneja todo automáticamente
  return (
    <SafeAreaView style={styles.container}>
      <AuthenticatedApp />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});