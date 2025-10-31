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
import { colors, sizes } from '../../utils';
import { useAppAuth } from '../hooks/useAppAuth';

interface Props {
  children: React.ReactNode;
  requireAuth?: boolean;
  title?: string;
  description?: string;
  onAuthRequired?: () => void;
}

/**
 * Componente que protege rutas que requieren autenticación
 */
export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  title = "Función Exclusiva",
  description = "Esta función está disponible solo para usuarios registrados",
  onAuthRequired
}: Props) {
  const { isAuthenticated, userType } = useAppAuth();
  const navigation = useNavigation<any>();

  // Si no requiere autenticación, mostrar el contenido
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Si está autenticado, mostrar el contenido
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Si no está autenticado, mostrar pantalla de bloqueo
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Ícono de bloqueo */}
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed" size={64} color={colors.primary} />
        </View>

        {/* Mensaje */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {/* Beneficios de registrarse */}
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Acceso a todas las funciones</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Notificaciones personalizadas</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Historial y favoritos sincronizados</Text>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => {
              if (onAuthRequired) {
                onAuthRequired();
              } else {
                navigation.navigate('AuthManager');
              }
            }}
          >
            <Ionicons name="person-add" size={20} color={colors.background} />
            <Text style={styles.registerButtonText}>Crear Cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              if (onAuthRequired) {
                onAuthRequired();
              } else {
                navigation.navigate('AuthManager');
              }
            }}
          >
            <Ionicons name="log-in" size={20} color={colors.primary} />
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Enlace para volver */}
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backLinkText}>← Volver atrás</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: sizes.padding.large,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.margin.xlarge,
  },
  title: {
    fontSize: sizes.xlarge,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: sizes.margin.medium,
  },
  description: {
    fontSize: sizes.medium,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: sizes.margin.xlarge,
  },
  benefitsContainer: {
    alignSelf: 'stretch',
    marginBottom: sizes.margin.xlarge,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.margin.medium,
    gap: sizes.margin.small,
  },
  benefitText: {
    fontSize: sizes.medium,
    color: colors.text,
    flex: 1,
  },
  actionButtons: {
    alignSelf: 'stretch',
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
  backLink: {
    padding: sizes.padding.medium,
  },
  backLinkText: {
    fontSize: sizes.medium,
    color: colors.muted,
  },
});