import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { colors, sizes } from '../../utils';
import { FirestoreEmpresaService } from '../../utils/firebaseServices';
import { FirebaseEmpresaAuthService } from '../../utils/firebaseEmpresaAuth';

interface EmpresaFormData {
  nombre: string;
  tipo: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  email: string;
  password: string;
  confirmPassword: string;
  logo?: string;
  conCuenta: boolean;
}

// Esquema de validación
const EmpresaSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .required('El nombre es requerido'),
  tipo: Yup.string()
    .required('El tipo de empresa es requerido'),
  descripcion: Yup.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(200, 'La descripción no puede exceder 200 caracteres')
    .required('La descripción es requerida'),
  direccion: Yup.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .required('La dirección es requerida'),
  telefono: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, 'Formato de teléfono inválido')
    .min(8, 'El teléfono debe tener al menos 8 dígitos'),
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: Yup.string()
    .when('conCuenta', {
      is: true,
      then: (schema) => schema
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es requerida'),
      otherwise: (schema) => schema.notRequired(),
    }),
  confirmPassword: Yup.string()
    .when('conCuenta', {
      is: true,
      then: (schema) => schema
        .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Confirma tu contraseña'),
      otherwise: (schema) => schema.notRequired(),
    }),
});

const tiposEmpresa = [
  'Bar',
  'Restaurante',
  'Licorería',
  'Pub',
  'Discoteca',
  'Lounge',
  'Cervecería',
  'Vinoteca',
  'Otro'
];

interface Props {
  onEmpresaCreated: (empresa: any) => void;
  onCancel: () => void;
  withAuth?: boolean; // Si true, incluye registro con cuenta
}

export default function RegistroEmpresa({ onEmpresaCreated, onCancel, withAuth = false }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Seleccionar logo de la empresa
   */
  const selectLogo = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesitan permisos para acceder a las fotos');
        return;
      }

      // Abrir selector de imágenes
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Cuadrado
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // Crear URI de datos base64 para almacenar
        const base64Uri = `data:image/jpeg;base64,${asset.base64}`;
        setLogoUri(base64Uri);
      }
    } catch (error) {
      console.error('Error seleccionando logo:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  /**
   * Manejar el registro de la empresa
   */
  const handleRegistroEmpresa = async (values: EmpresaFormData) => {
    try {
      setIsLoading(true);
      console.log('🏢 Registrando nueva empresa:', values.nombre);

      // Crear objeto empresa
      const empresaData = {
        nombre: values.nombre.trim(),
        tipo: values.tipo,
        descripcion: values.descripcion.trim(),
        direccion: values.direccion.trim(),
        telefono: values.telefono.trim(),
        email: values.email.trim().toLowerCase(),
        logo: logoUri,
      };

      let empresaId: string | null = null;
      let mensaje = '';

      if (values.conCuenta && values.password) {
        // Registro con autenticación
        const result = await FirebaseEmpresaAuthService.registerEmpresa(
          values.email.trim().toLowerCase(),
          values.password,
          empresaData
        );

        if (result.success) {
          empresaId = result.empresaId || null;
          mensaje = `"${values.nombre}" ha sido registrada con cuenta de acceso. ¡Ya puedes gestionar tu empresa!`;
        } else {
          Alert.alert('Error', result.error || 'No se pudo registrar la empresa con cuenta.');
          return;
        }
      } else {
        // Registro simple sin cuenta
        empresaId = await FirestoreEmpresaService.createEmpresa(empresaData);
        mensaje = `"${values.nombre}" ha sido registrada exitosamente. ¡Bienvenido a DrinkMate!`;
      }

      if (empresaId) {
        Alert.alert(
          'Empresa Registrada',
          mensaje,
          [
            {
              text: 'OK',
              onPress: () => {
                onEmpresaCreated({
                  id: empresaId,
                  ...empresaData,
                  conCuenta: values.conCuenta,
                });
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'No se pudo registrar la empresa. Inténtalo de nuevo.');
      }

    } catch (error) {
      console.error('❌ Error registrando empresa:', error);
      Alert.alert('Error', 'No se pudo registrar la empresa. Inténtalo de nuevo.');
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
          <Text style={styles.headerTitle}>Registrar Empresa</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Formik
            initialValues={{
              nombre: '',
              tipo: 'Bar',
              descripcion: '',
              direccion: '',
              telefono: '',
              email: '',
              password: '',
              confirmPassword: '',
              conCuenta: withAuth,
            }}
            validationSchema={EmpresaSchema}
            onSubmit={handleRegistroEmpresa}
          >
            {({ values, handleChange, handleSubmit, errors, touched, isValid, setFieldValue }) => (
              <View style={styles.formContainer}>
                
                {/* Logo de la empresa */}
                <View style={styles.logoSection}>
                  <Text style={styles.inputLabel}>Logo de la Empresa</Text>
                  <TouchableOpacity style={styles.logoContainer} onPress={selectLogo}>
                    {logoUri ? (
                      <Image source={{ uri: logoUri }} style={styles.logoImage} />
                    ) : (
                      <View style={styles.logoPlaceholder}>
                        <Ionicons name="camera" size={32} color={colors.muted} />
                        <Text style={styles.logoPlaceholderText}>Seleccionar Logo</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <Text style={styles.helperText}>Toca para seleccionar una imagen</Text>
                </View>

                {/* Nombre de la empresa */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nombre de la Empresa *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.nombre && errors.nombre && styles.inputError
                    ]}
                    placeholder="Ej: Bar Central"
                    placeholderTextColor={colors.muted}
                    value={values.nombre}
                    onChangeText={handleChange('nombre')}
                    maxLength={50}
                  />
                  <Text style={styles.characterCount}>{values.nombre.length}/50</Text>
                  {touched.nombre && errors.nombre && (
                    <Text style={styles.errorText}>{errors.nombre}</Text>
                  )}
                </View>

                {/* Tipo de empresa */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tipo de Empresa *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tiposScroll}>
                    {tiposEmpresa.map((tipo) => (
                      <TouchableOpacity
                        key={tipo}
                        style={[
                          styles.tipoButton,
                          values.tipo === tipo && styles.tipoButtonActive
                        ]}
                        onPress={() => setFieldValue('tipo', tipo)}
                      >
                        <Text style={[
                          styles.tipoButtonText,
                          values.tipo === tipo && styles.tipoButtonTextActive
                        ]}>
                          {tipo}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Descripción */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Descripción *</Text>
                  <TextInput
                    style={[
                      styles.textArea,
                      touched.descripcion && errors.descripcion && styles.inputError
                    ]}
                    placeholder="Describe tu empresa, ambiente, especialidades..."
                    placeholderTextColor={colors.muted}
                    value={values.descripcion}
                    onChangeText={handleChange('descripcion')}
                    multiline
                    numberOfLines={3}
                    maxLength={200}
                  />
                  <Text style={styles.characterCount}>{values.descripcion.length}/200</Text>
                  {touched.descripcion && errors.descripcion && (
                    <Text style={styles.errorText}>{errors.descripcion}</Text>
                  )}
                </View>

                {/* Dirección */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Dirección *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.direccion && errors.direccion && styles.inputError
                    ]}
                    placeholder="Calle, número, ciudad"
                    placeholderTextColor={colors.muted}
                    value={values.direccion}
                    onChangeText={handleChange('direccion')}
                  />
                  {touched.direccion && errors.direccion && (
                    <Text style={styles.errorText}>{errors.direccion}</Text>
                  )}
                </View>

                {/* Teléfono */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Teléfono</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.telefono && errors.telefono && styles.inputError
                    ]}
                    placeholder="+54 11 1234-5678"
                    placeholderTextColor={colors.muted}
                    value={values.telefono}
                    onChangeText={handleChange('telefono')}
                    keyboardType="phone-pad"
                  />
                  {touched.telefono && errors.telefono && (
                    <Text style={styles.errorText}>{errors.telefono}</Text>
                  )}
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.email && errors.email && styles.inputError
                    ]}
                    placeholder="contacto@empresa.com"
                    placeholderTextColor={colors.muted}
                    value={values.email}
                    onChangeText={handleChange('email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                {/* Opción de crear cuenta */}
                {withAuth && (
                  <>
                    <View style={styles.inputGroup}>
                      <View style={styles.checkboxContainer}>
                        <TouchableOpacity
                          style={[
                            styles.checkbox,
                            values.conCuenta && styles.checkboxActive
                          ]}
                          onPress={() => setFieldValue('conCuenta', !values.conCuenta)}
                        >
                          {values.conCuenta && (
                            <Ionicons name="checkmark" size={16} color={colors.background} />
                          )}
                        </TouchableOpacity>
                        <Text style={styles.checkboxLabel}>
                          Crear cuenta para gestionar mi empresa
                        </Text>
                      </View>
                      <Text style={styles.helperText}>
                        Con una cuenta podrás crear cupones, ver estadísticas y gestionar tu negocio
                      </Text>
                    </View>

                    {/* Campos de contraseña (solo si quiere cuenta) */}
                    {values.conCuenta && (
                      <>
                        {/* Contraseña */}
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>Contraseña *</Text>
                          <View style={styles.passwordContainer}>
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
                          <Text style={styles.inputLabel}>Confirmar Contraseña *</Text>
                          <View style={styles.passwordContainer}>
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
                      </>
                    )}
                  </>
                )}

                {/* Botones de acción */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onCancel}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.registerButton,
                      (!isValid || isLoading) && styles.registerButtonDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={!isValid || isLoading}
                  >
                    <Ionicons 
                      name={isLoading ? "hourglass" : "checkmark"} 
                      size={16} 
                      color={colors.background} 
                    />
                    <Text style={styles.registerButtonText}>
                      {isLoading ? 'Registrando...' : 'Registrar Empresa'}
                    </Text>
                  </TouchableOpacity>
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
  formContainer: {
    padding: Math.max(16, width * 0.04),
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: sizes.margin.xlarge,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: sizes.margin.small,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholderText: {
    fontSize: sizes.small,
    color: colors.muted,
    marginTop: sizes.margin.small,
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
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.borderRadius.medium,
    paddingHorizontal: sizes.padding.medium,
    paddingVertical: sizes.padding.medium,
    fontSize: sizes.medium,
    color: colors.text,
    backgroundColor: colors.background,
    minHeight: sizes.inputHeight,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.borderRadius.medium,
    paddingHorizontal: sizes.padding.medium,
    paddingVertical: sizes.padding.medium,
    fontSize: sizes.medium,
    color: colors.text,
    backgroundColor: colors.background,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  characterCount: {
    fontSize: sizes.small,
    color: colors.muted,
    textAlign: 'right',
    marginTop: sizes.margin.small,
  },
  errorText: {
    fontSize: sizes.small,
    color: colors.error,
    marginTop: sizes.margin.small,
  },
  helperText: {
    fontSize: sizes.small,
    color: colors.muted,
    textAlign: 'center',
  },
  tiposScroll: {
    marginHorizontal: -sizes.margin.small,
  },
  tipoButton: {
    paddingVertical: sizes.padding.small,
    paddingHorizontal: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginHorizontal: sizes.margin.small,
  },
  tipoButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tipoButtonText: {
    fontSize: sizes.small,
    fontWeight: '600',
    color: colors.text,
  },
  tipoButtonTextActive: {
    color: colors.background,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: sizes.margin.medium,
    marginTop: sizes.margin.xlarge,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.muted,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.muted,
  },
  registerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    backgroundColor: colors.primary,
    gap: sizes.margin.small,
  },
  registerButtonDisabled: {
    backgroundColor: colors.muted,
  },
  registerButtonText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.background,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.margin.small,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 4,
    marginRight: sizes.margin.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: sizes.medium,
    color: colors.text,
    flex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.borderRadius.medium,
    backgroundColor: colors.background,
    minHeight: sizes.inputHeight,
  },
  passwordToggle: {
    padding: sizes.padding.medium,
  },
});