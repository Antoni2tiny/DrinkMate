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
import { FirebaseAuthService } from '../../utils/firebaseAuth';
import { FirestoreUserService } from '../../utils/firebaseServices';

interface RegistroFormData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Esquema de validación
const RegistroSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .required('El nombre es requerido'),
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Debe contener al menos una mayúscula, una minúscula y un número')
    .required('La contraseña es requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});

interface Props {
  onRegistroSuccess: (user: any) => void;
  onNavigateToLogin: () => void;
  onCancel: () => void;
}

export default function Registro({ onRegistroSuccess, onNavigateToLogin, onCancel }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Manejar el registro
   */
  const handleRegistro = async (values: RegistroFormData) => {
    try {
      setIsLoading(true);
      console.log('📝 Registrando usuario:', values.email);

      // Registrar en Firebase Auth
      const result = await FirebaseAuthService.register(
        values.email, 
        values.password, 
        values.nombre
      );

      if (result.success && result.user) {
        console.log('✅ Registro exitoso:', result.user.email);
        
        // Crear perfil de usuario en Firestore
        await FirestoreUserService.createUserProfile(result.user.uid, {
          nombre: values.nombre,
          email: values.email,
          fechaRegistro: new Date().toISOString(),
          activo: true,
        });

        Alert.alert(
          'Registro Exitoso',
          `¡Bienvenido ${values.nombre}! Tu cuenta ha sido creada correctamente.`,
          [
            {
              text: 'OK',
              onPress: () => onRegistroSuccess(result.user),
            },
          ]
        );
      } else {
        Alert.alert('Error de Registro', result.error || 'No se pudo crear la cuenta');
      }

    } catch (error) {
      console.error('❌ Error en registro:', error);
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
          <Text style={styles.headerTitle}>Crear Cuenta</Text>
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
              <Ionicons name="person-add" size={64} color={colors.primary} />
            </View>
            <Text style={styles.welcomeTitle}>¡Únete a DrinkMate!</Text>
            <Text style={styles.welcomeSubtitle}>Crea tu cuenta para comenzar</Text>
          </View>

          <Formik
            initialValues={{
              nombre: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={RegistroSchema}
            onSubmit={handleRegistro}
          >
            {({ values, handleChange, handleSubmit, errors, touched, isValid }) => (
              <View style={styles.formContainer}>
                
                {/* Nombre */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nombre Completo</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person" size={20} color={colors.muted} style={styles.inputIcon} />
                    <TextInput
                      style={[
                        styles.input,
                        touched.nombre && errors.nombre && styles.inputError
                      ]}
                      placeholder="Tu nombre completo"
                      placeholderTextColor={colors.muted}
                      value={values.nombre}
                      onChangeText={handleChange('nombre')}
                      autoCapitalize="words"
                      autoComplete="name"
                    />
                  </View>
                  {touched.nombre && errors.nombre && (
                    <Text style={styles.errorText}>{errors.nombre}</Text>
                  )}
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="mail" size={20} color={colors.muted} style={styles.inputIcon} />
                    <TextInput
                      style={[
                        styles.input,
                        touched.email && errors.email && styles.inputError
                      ]}
                      placeholder="tu@email.com"
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
                      placeholder="Mínimo 6 caracteres"
                      placeholderTextColor={colors.muted}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      secureTextEntry={!showPassword}
                      autoComplete="new-password"
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

                {/* Confirmar Contraseña */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirmar Contraseña</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed" size={20} color={colors.muted} style={styles.inputIcon} />
                    <TextInput
                      style={[
                        styles.input,
                        touched.confirmPassword && errors.confirmPassword && styles.inputError
                      ]}
                      placeholder="Repite tu contraseña"
                      placeholderTextColor={colors.muted}
                      value={values.confirmPassword}
                      onChangeText={handleChange('confirmPassword')}
                      secureTextEntry={!showConfirmPassword}
                      autoComplete="new-password"
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Ionicons 
                        name={showConfirmPassword ? "eye-off" : "eye"} 
                        size={20} 
                        color={colors.muted} 
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  )}
                </View>

                {/* Indicadores de seguridad */}
                <View style={styles.securityIndicators}>
                  <Text style={styles.securityTitle}>Requisitos de contraseña:</Text>
                  <View style={styles.securityItem}>
                    <Ionicons 
                      name={values.password.length >= 6 ? "checkmark-circle" : "ellipse-outline"} 
                      size={16} 
                      color={values.password.length >= 6 ? colors.success : colors.muted} 
                    />
                    <Text style={[
                      styles.securityText,
                      values.password.length >= 6 && styles.securityTextValid
                    ]}>
                      Mínimo 6 caracteres
                    </Text>
                  </View>
                  <View style={styles.securityItem}>
                    <Ionicons 
                      name={/[A-Z]/.test(values.password) ? "checkmark-circle" : "ellipse-outline"} 
                      size={16} 
                      color={/[A-Z]/.test(values.password) ? colors.success : colors.muted} 
                    />
                    <Text style={[
                      styles.securityText,
                      /[A-Z]/.test(values.password) && styles.securityTextValid
                    ]}>
                      Una letra mayúscula
                    </Text>
                  </View>
                  <View style={styles.securityItem}>
                    <Ionicons 
                      name={/[a-z]/.test(values.password) ? "checkmark-circle" : "ellipse-outline"} 
                      size={16} 
                      color={/[a-z]/.test(values.password) ? colors.success : colors.muted} 
                    />
                    <Text style={[
                      styles.securityText,
                      /[a-z]/.test(values.password) && styles.securityTextValid
                    ]}>
                      Una letra minúscula
                    </Text>
                  </View>
                  <View style={styles.securityItem}>
                    <Ionicons 
                      name={/\d/.test(values.password) ? "checkmark-circle" : "ellipse-outline"} 
                      size={16} 
                      color={/\d/.test(values.password) ? colors.success : colors.muted} 
                    />
                    <Text style={[
                      styles.securityText,
                      /\d/.test(values.password) && styles.securityTextValid
                    ]}>
                      Un número
                    </Text>
                  </View>
                </View>

                {/* Botón de Registro */}
                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    (!isValid || isLoading) && styles.registerButtonDisabled
                  ]}
                  onPress={handleSubmit}
                  disabled={!isValid || isLoading}
                >
                  <Ionicons 
                    name={isLoading ? "hourglass" : "person-add"} 
                    size={20} 
                    color={colors.background} 
                  />
                  <Text style={styles.registerButtonText}>
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Text>
                </TouchableOpacity>

                {/* Enlace a login */}
                <View style={styles.loginSection}>
                  <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
                  <TouchableOpacity onPress={onNavigateToLogin}>
                    <Text style={styles.loginLink}>Inicia sesión aquí</Text>
                  </TouchableOpacity>
                </View>

                {/* Términos y condiciones */}
                <View style={styles.termsSection}>
                  <Text style={styles.termsText}>
                    Al crear una cuenta, aceptas nuestros{' '}
                    <Text style={styles.termsLink}>Términos de Servicio</Text>
                    {' '}y{' '}
                    <Text style={styles.termsLink}>Política de Privacidad</Text>
                  </Text>
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
    backgroundColor: colors.background,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: sizes.padding.xlarge,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: sizes.padding.large,
    paddingHorizontal: Math.max(16, width * 0.04),
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.margin.large,
  },
  welcomeTitle: {
    fontSize: sizes.xlarge,
    fontWeight: 'bold',
    color: colors.text,
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
    color: colors.text,
    marginBottom: sizes.margin.small,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.borderRadius.medium,
    backgroundColor: colors.background,
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
    color: colors.text,
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
  securityIndicators: {
    backgroundColor: colors.surface,
    padding: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    marginBottom: sizes.margin.large,
  },
  securityTitle: {
    fontSize: sizes.small,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.margin.small,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.margin.small,
    gap: sizes.margin.small,
  },
  securityText: {
    fontSize: sizes.small,
    color: colors.muted,
  },
  securityTextValid: {
    color: colors.success,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    gap: sizes.margin.small,
    marginTop: sizes.margin.medium,
  },
  registerButtonDisabled: {
    backgroundColor: colors.muted,
  },
  registerButtonText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.background,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: sizes.margin.large,
    gap: sizes.margin.small,
  },
  loginText: {
    fontSize: sizes.medium,
    color: colors.muted,
  },
  loginLink: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.primary,
  },
  termsSection: {
    marginTop: sizes.margin.large,
    paddingHorizontal: sizes.padding.medium,
  },
  termsText: {
    fontSize: sizes.small,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});