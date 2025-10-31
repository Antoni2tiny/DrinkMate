import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppAuth } from '../hooks/useAppAuth';
import { colors, sizes } from '../../utils';

// Importar tus pantallas
import HomeUsuario from '../screens/HomeUsuario';
import EmpresaPanel from '../screens/EmpresaPanel';
import AuthManager from '../screens/AuthManager';
import EmpresaAuthManager from '../screens/EmpresaAuthManager';

/**
 * Componente que maneja la navegación según el tipo de usuario autenticado
 */
export default function AuthenticatedApp() {
  const { userType, isLoading, currentUser, userAuth, empresaAuth } = useAppAuth();
  const [showAuthType, setShowAuthType] = useState<'user' | 'empresa' | null>(null);

  // Mostrar loading mientras se determina el estado de autenticación
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  // Si hay un proceso de autenticación en curso
  if (showAuthType === 'user') {
    return (
      <AuthManager
        onAuthSuccess={(user) => {
          console.log('✅ Usuario autenticado:', user.email);
          setShowAuthType(null);
        }}
        onCancel={() => setShowAuthType(null)}
      />
    );
  }

  if (showAuthType === 'empresa') {
    return (
      <EmpresaAuthManager
        onAuthSuccess={(user, empresa) => {
          console.log('✅ Empresa autenticada:', empresa.nombre);
          setShowAuthType(null);
        }}
        onCancel={() => setShowAuthType(null)}
      />
    );
  }

  // Renderizar según el tipo de usuario
  switch (userType) {
    case 'user':
      return (
        <HomeUsuario 
          // Puedes pasar props adicionales aquí
          onNavigateToAuth={() => setShowAuthType('user')}
          onNavigateToEmpresaAuth={() => setShowAuthType('empresa')}
        />
      );
      
    case 'empresa':
      return (
        <EmpresaPanel 
          // Puedes pasar props adicionales aquí
        />
      );
      
    case 'guest':
    default:
      return (
        <HomeUsuario 
          // Modo invitado - funcionalidad limitada
          onNavigateToAuth={() => setShowAuthType('user')}
          onNavigateToEmpresaAuth={() => setShowAuthType('empresa')}
        />
      );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: sizes.margin.medium,
    fontSize: sizes.medium,
    color: colors.text,
  },
});