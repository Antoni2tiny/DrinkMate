import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, sizes } from '../../utils';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function UserTypeSelection() {
  const navigation = useNavigation();

  /**
   * Maneja la selección del tipo de usuario
   */
  const handleUserTypeSelection = (userType: 'usuario' | 'empresa') => {
    try {
      console.log('Tipo de usuario seleccionado:', userType);
      
      // Navegar a Main con el tipo de usuario
      // En una app real, aquí guardarías el tipo de usuario en el estado global o AsyncStorage
      navigation.navigate('Main', { userType });
      
    } catch (error) {
      console.error('Error seleccionando tipo de usuario:', error);
      Alert.alert('Error', 'Hubo un problema al seleccionar el tipo de usuario.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="wine" size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>DrinkMate</Text>
          <Text style={styles.subtitle}>Selecciona tu tipo de cuenta</Text>
        </View>

        {/* Opciones de usuario */}
        <View style={styles.optionsContainer}>
          {/* Opción Usuario */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleUserTypeSelection('usuario')}
            activeOpacity={0.8}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="person" size={40} color={colors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Usuario</Text>
              <Text style={styles.optionDescription}>
                Explora tragos, guarda favoritos, sube tus propias recetas y descubre nuevos lugares.
              </Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.featureText}>Explorar recetas</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.featureText}>Guardar favoritos</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.featureText}>Subir tragos</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Opción Empresa */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleUserTypeSelection('empresa')}
            activeOpacity={0.8}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="business" size={40} color={colors.accent} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Empresa</Text>
              <Text style={styles.optionDescription}>
                Gestiona tu negocio, envía notificaciones a clientes y promociona tus productos.
              </Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.featureText}>Panel de control</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.featureText}>Enviar notificaciones</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.featureText}>Gestionar promociones</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Podrás cambiar el tipo de cuenta más tarde en la configuración
          </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: Math.max(16, width * 0.05), // Padding adaptativo
    paddingVertical: Math.max(20, height * 0.03),
  },
  header: {
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
  title: {
    fontSize: Math.min(32, width * 0.08), // Tamaño adaptativo
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: sizes.margin.small,
  },
  subtitle: {
    fontSize: Math.min(18, width * 0.045),
    color: colors.muted,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    gap: Math.max(16, height * 0.02),
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.large,
    padding: Math.max(20, width * 0.05),
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionIcon: {
    alignSelf: 'center',
    marginBottom: sizes.margin.medium,
  },
  optionContent: {
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: Math.min(24, width * 0.06),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.margin.small,
  },
  optionDescription: {
    fontSize: Math.min(16, width * 0.04),
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: sizes.margin.medium,
  },
  featuresList: {
    alignSelf: 'stretch',
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
  footer: {
    alignItems: 'center',
    marginTop: Math.max(20, height * 0.025),
  },
  footerText: {
    fontSize: Math.min(14, width * 0.035),
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
});