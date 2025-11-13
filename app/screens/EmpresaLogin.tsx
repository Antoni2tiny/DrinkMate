import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { colors, sizes } from '../../utils';
import { FirebaseEmpresaAuthService } from '../../utils/firebaseEmpresaAuth';
import { useNavigation } from '@react-navigation/native';

interface LoginFormData {
  email: string;
  password: string;
}

// Esquema de validación
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
});

interface Props {
  onLoginSuccess: (user: any, empresa: any) => void;
  onNavigateToRegister: () => void;
  onCancel: () => void;
}

export default function EmpresaLogin({ onLoginSuccess, onNavigateToRegister, onCancel }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<any>();

  /**
   * Manejar el login de empresa
   */
  const handleLogin = async (values: LoginFormData) => {
    try {
      setIsLoading(true);
      console.log('🏢 Iniciando sesión empresa:', values.email);

      const result = await FirebaseEmpresaAuthService.loginEmpresa(values.email, values.password);

      if (result.success && result.user && result.empresa) {
        console.log('✅ Login empresa exitoso:', result.empresa.nombre);
        
        // Primero llamamos al callback de éxito
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess(result.user, result.empresa);
        }
        
        // Luego mostramos la alerta de bienvenida
        Alert.alert(
          'Bienvenido',
          `¡Hola ${result.empresa.nombre}! Acceso al panel de empresa concedido.`,
          [{ text: 'OK' }]
        );

        // Navegar al panel de empresa
        try {
          navigation.reset({
            index: 0,
            routes: [{ name: 'EmpresaTabs' }],
          });
        } catch (navErr) {
          console.log('Navegación no disponible, intentando navigate simple:', navErr);
          // Fallback a navigate si reset no está disponible
          // @ts-ignore
          navigation.navigate && navigation.navigate('EmpresaTabs');
        }
      } else {
        Alert.alert('Error de Login', result.error || 'No se pudo iniciar sesión');
      }

    } catch (error) {
      console.error('❌ Error en login empresa:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onCancel}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Acceso Empresas</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo/Icono */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="business" size={64} color={colors.primary} />
            </View>
            <Text style={styles.welcomeTitle}>Panel de Empresa</Text>
            <Text style={styles.welcomeSubtitle}>Inicia sesión para gestionar tu negocio</Text>
          </View>

          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ values, handleChange, handleSubmit, errors, touched, isValid }) => (
              <View style={styles.formContainer}>
                
                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email de la Empresa</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="mail" size={20} color={colors.muted} style={styles.inputIcon} />
                    <TextInput
                      style={[
                        styles.input,
                        touched.email && errors.email && styles.inputError
                      ]}
                      placeholder="empresa@email.com"
                      placeholderTextColor={colors.muted}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                {/* Contraseña */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Contraseña</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed" size={20} color={colors.muted} style={styles.inputIcon} />
                    <TextInput
                      style={[
                        styles.input,
                        touched.password && errors.password && styles.inputError
                      ]}
                      placeholder="Tu contraseña"
                      placeholderTextColor={colors.muted}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off" : "eye"} 
                        size={20} 
                        color={colors.muted} 
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                {/* Botón de Login */}
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    (!isValid || isLoading) && styles.loginButtonDisabled
                  ]}
                  onPress={() => handleSubmit()}
                  disabled={!isValid || isLoading}
                >
                  <Ionicons 
                    name={isLoading ? "hourglass" : "business"} 
                    size={20} 
                    color={colors.background} 
                  />
                  <Text style={styles.loginButtonText}>
                    {isLoading ? 'Verificando...' : 'Acceder al Panel'}
                  </Text>
                </TouchableOpacity>

                {/* Enlace a registro eliminado */}

                {/* Información adicional */}
                <View style={styles.infoSection}>
                  <View style={styles.infoCard}>
                    <Ionicons name="information-circle" size={20} color={colors.primary} />
                    <Text style={styles.infoText}>
                      Con tu cuenta de empresa puedes crear cupones, gestionar promociones 
                      y acceder a estadísticas de tu negocio.
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBackground,
  },
  keyboardView: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: sizes.padding.xlarge,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: sizes.padding.xlarge,
    paddingHorizontal: Math.max(16, width * 0.04),
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.darkSurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.margin.large,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  welcomeTitle: {
    fontSize: sizes.xlarge,
    fontWeight: 'bold',
    color: colors.darkText,
    marginBottom: sizes.margin.small,
  },
  welcomeSubtitle: {
    fontSize: sizes.medium,
    color: colors.muted,
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: Math.max(16, width * 0.04),
  },
  inputGroup: {
    marginBottom: sizes.margin.large,
  },
  inputLabel: {
    fontSize: sizes.medium,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: sizes.margin.small,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.borderRadius.medium,
    backgroundColor: colors.darkBackground,
    minHeight: sizes.inputHeight,
  },
  inputIcon: {
    marginLeft: sizes.padding.medium,
  },
  input: {
    flex: 1,
    paddingHorizontal: sizes.padding.medium,
    paddingVertical: sizes.padding.medium,
    fontSize: sizes.medium,
    color: colors.darkText,
  },
  passwordToggle: {
    padding: sizes.padding.medium,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: sizes.small,
    color: colors.error,
    marginTop: sizes.margin.small,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    gap: sizes.margin.small,
    marginTop: sizes.margin.medium,
  },
  loginButtonDisabled: {
    backgroundColor: colors.muted,
  },
  loginButtonText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  registerSection: {
    alignItems: 'center',
    marginTop: sizes.margin.large,
    gap: sizes.margin.small,
  },
  registerText: {
    fontSize: sizes.medium,
    color: colors.muted,
    textAlign: 'center',
  },
  registerLink: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.primary,
  },
  infoSection: {
    marginTop: sizes.margin.xlarge,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.darkSurface,
    padding: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    gap: sizes.margin.small,
  },
  infoText: {
    flex: 1,
    fontSize: sizes.small,
    color: colors.muted,
    lineHeight: 18,
  },
});