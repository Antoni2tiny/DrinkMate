import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAppAuth } from '../hooks/useAppAuth';
import { colors, sizes } from '../../utils';

interface Props {
  title?: string;
  showAuthButton?: boolean;
  onAuthPress?: () => void;
  onEmpresaAuthPress?: () => void;
}

/**
 * Header inteligente que se adapta según el tipo de usuario
 */
export default function SmartHeader({ 
  title, 
  showAuthButton = true, 
  onAuthPress, 
  onEmpresaAuthPress 
}: Props) {
  const { userType, currentUser, logoutAll, isAuthenticated } = useAppAuth();
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutAll();
            } finally {
              try {
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
              } catch (e) {
                // @ts-ignore
                navigation.navigate && navigation.navigate('Home');
              }
            }
          }
        },
      ]
    );
  };

  const getHeaderStyle = () => {
    switch (userType) {
      case 'empresa':
        return styles.empresaHeader;
      case 'user':
        return styles.userHeader;
      default:
        return styles.guestHeader;
    }
  };

  const getIcon = () => {
    switch (userType) {
      case 'empresa':
        return 'business';
      case 'user':
        return 'person';
      default:
        return 'wine';
    }
  };

  const getWelcomeMessage = () => {
    switch (userType) {
      case 'empresa':
        return `¡Hola ${currentUser.displayName}!`;
      case 'user':
        return `¡Bienvenido ${currentUser.displayName}!`;
      default:
        return '¡Bienvenido a DrinkMate!';
    }
  };

  const getSubtitle = () => {
    switch (userType) {
      case 'empresa':
        return 'Panel de gestión empresarial';
      case 'user':
        return 'Descubre los mejores bares';
      default:
        return 'Inicia sesión para más beneficios';
    }
  };

  return (
    <View style={[styles.header, getHeaderStyle()]}>
      {/* Información del usuario */}
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Ionicons name={getIcon()} size={32} color={colors.darkText} />
        </View>
        <View style={styles.textInfo}>
          <Text style={styles.welcomeText}>
            {title || getWelcomeMessage()}
          </Text>
          <Text style={styles.subtitleText}>
            {getSubtitle()}
          </Text>
        </View>
      </View>

      {/* Botones de acción */}
      <View style={styles.actions}>
        {isAuthenticated ? (
          // Usuario autenticado - mostrar logout
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color={colors.error} />
          </TouchableOpacity>
        ) : showAuthButton ? (
          // Usuario no autenticado - mostrar opciones de login
          <View style={styles.authButtons}>
            <TouchableOpacity 
              style={styles.authButton} 
              onPress={onAuthPress}
            >
              <Ionicons name="person" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.authButton} 
              onPress={onEmpresaAuthPress}
            >
              <Ionicons name="business" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.padding.medium,
    paddingVertical: sizes.padding.large,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  guestHeader: {
    backgroundColor: colors.surface,
  },
  userHeader: {
    backgroundColor: colors.surface,
  },
  empresaHeader: {
    backgroundColor: colors.darkSurface,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  textInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: sizes.large,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitleText: {
    fontSize: sizes.small,
    color: colors.muted,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authButtons: {
    flexDirection: 'row',
    gap: sizes.margin.small,
  },
  authButton: {
    padding: sizes.padding.small,
    borderRadius: sizes.borderRadius.small,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  logoutButton: {
    padding: sizes.padding.small,
    borderRadius: sizes.borderRadius.small,
    backgroundColor: colors.surface,
  },
});