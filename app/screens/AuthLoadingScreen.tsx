import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAppAuth } from '../hooks/useAppAuth';
import { useNavigation } from '@react-navigation/native';

export default function AuthLoadingScreen() {
  const { currentUser, userType, isLoading } = useAppAuth();
  const navigation = useNavigation();

  useEffect(() => {
    // Asegurarse de que la autenticación ha terminado de cargarse
    // y que el currentUser.user es el valor final para este ciclo de carga
    if (!isLoading && (userType === 'guest' || currentUser.user)) {
      if (currentUser && currentUser.user) {
        // Usuario o Empresa logueado
        navigation.replace('UserTabs');
      } else {
        // No hay usuario logueado, ir a GuestTabs
        navigation.replace('GuestTabs');
      }
    }
  }, [isLoading, currentUser.user, userType, navigation]); // Dependencia en currentUser.user para una re-evaluación más precisa

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Cargando sesión...</Text>
      </View>
    );
  }

  // Si isLoading es false, y ya hemos navegado, este componente se desmontará.
  // Si por alguna razón no se navega (ej. error inesperado), podría retornar null o una pantalla de error.
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333333',
  },
});
