import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { colors, sizes } from '../../utils';
import { Cupon } from '../../utils/models';

const { width } = Dimensions.get('window');

interface CuponFormData {
  titulo: string;
  descripcion: string;
  tipoDescuento: 'porcentaje' | 'monto_fijo' | 'promocion_especial';
  valorDescuento: string;
  codigoCupon: string;
  fechaVencimiento: string;
  limiteCanjeos: string;
  condiciones: string;
}

// Esquema de validación
const CuponSchema = Yup.object().shape({
  titulo: Yup.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(50, 'El título no puede exceder 50 caracteres')
    .required('El título es requerido'),
  descripcion: Yup.string()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(150, 'La descripción no puede exceder 150 caracteres')
    .required('La descripción es requerida'),
  valorDescuento: Yup.string()
    .required('El valor de descuento es requerido')
    .test('is-number', 'Debe ser un número válido mayor a 0', (value) => {
      if (!value) return false;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    }),
  fechaVencimiento: Yup.string()
    .required('La fecha de vencimiento es requerida')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  limiteCanjeos: Yup.string()
    .test('is-valid-number', 'Debe ser un número válido entre 1 y 1000', (value) => {
      if (!value || value.trim() === '') return true; // Campo opcional
      const num = parseInt(value);
      return !isNaN(num) && num >= 1 && num <= 1000;
    }),
});

interface Props {
  onCuponCreated: (cupon: Partial<Cupon>) => void;
  onCancel: () => void;
}

export default function CuponCreator({ onCuponCreated, onCancel }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Maneja la creación del cupón
   */
  const handleCreateCupon = async (values: CuponFormData) => {
    try {
      console.log('Iniciando creación de cupón con valores:', values);
      setIsLoading(true);

      // Validar campos críticos
      if (!values.titulo.trim()) {
        Alert.alert('Error', 'El título es requerido');
        return;
      }
      
      if (!values.descripcion.trim()) {
        Alert.alert('Error', 'La descripción es requerida');
        return;
      }
      
      if (!values.valorDescuento || isNaN(parseFloat(values.valorDescuento))) {
        Alert.alert('Error', 'El valor de descuento debe ser un número válido');
        return;
      }

      // Crear objeto cupón
      const nuevoCupon: Partial<Cupon> = {
        titulo: values.titulo.trim(),
        descripcion: values.descripcion.trim(),
        tipoDescuento: values.tipoDescuento,
        valorDescuento: parseFloat(values.valorDescuento),
        codigoCupon: values.codigoCupon.trim().toUpperCase() || generateCuponCode(values.titulo),
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaVencimiento: values.fechaVencimiento,
        limiteCanjeos: values.limiteCanjeos && values.limiteCanjeos.trim() 
          ? parseInt(values.limiteCanjeos) 
          : null, // Usar null en lugar de undefined
        canjeosActuales: 0,
        condiciones: values.condiciones.trim(),
        activo: true,
        colorFondo: colors.primary,
        colorTexto: colors.background,
      };

      console.log('Cupón a crear:', nuevoCupon);

      // Simular guardado (en una app real iría a la base de datos)
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert(
        'Cupón Creado',
        `El cupón "${values.titulo}" ha sido creado exitosamente.`,
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Llamando onCuponCreated');
              onCuponCreated(nuevoCupon);
            },
          },
        ]
      );

    } catch (error) {
      console.error('Error creando cupón:', error);
      Alert.alert('Error', 'No se pudo crear el cupón. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Genera un código de cupón automático
   */
  const generateCuponCode = (titulo: string): string => {
    const prefix = titulo.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
    const suffix = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}${suffix}`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onCancel}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Cupón</Text>
        <View style={styles.placeholder} />
      </View>

      <Formik
        initialValues={{
          titulo: '',
          descripcion: '',
          tipoDescuento: 'porcentaje' as const,
          valorDescuento: '',
          codigoCupon: '',
          fechaVencimiento: '',
          limiteCanjeos: '',
          condiciones: '',
        }}
        validationSchema={CuponSchema}
        onSubmit={handleCreateCupon}
      >
        {({ values, handleChange, handleSubmit, errors, touched, isValid, setFieldValue }) => (
          <View style={styles.formContainer}>
            {/* Título del cupón */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Título del Cupón *</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.titulo && errors.titulo && styles.inputError
                ]}
                placeholder="Ej: 20% OFF en Cócteles"
                placeholderTextColor={colors.muted}
                value={values.titulo}
                onChangeText={(text) => {
                  handleChange('titulo')(text);
                  // Auto-generar código si está vacío
                  if (!values.codigoCupon && text.length > 3) {
                    setFieldValue('codigoCupon', generateCuponCode(text));
                  }
                }}
                maxLength={50}
              />
              <Text style={styles.characterCount}>{values.titulo.length}/50</Text>
              {touched.titulo && errors.titulo && (
                <Text style={styles.errorText}>{errors.titulo}</Text>
              )}
            </View>

            {/* Descripción */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descripción *</Text>
              <TextInput
                style={[
                  styles.textArea,
                  touched.descripcion && errors.descripcion && styles.inputError
                ]}
                placeholder="Describe los detalles del descuento..."
                placeholderTextColor={colors.muted}
                value={values.descripcion}
                onChangeText={handleChange('descripcion')}
                multiline
                numberOfLines={3}
                maxLength={150}
              />
              <Text style={styles.characterCount}>{values.descripcion.length}/150</Text>
              {touched.descripcion && errors.descripcion && (
                <Text style={styles.errorText}>{errors.descripcion}</Text>
              )}
            </View>

            {/* Tipo de descuento */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipo de Descuento *</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    values.tipoDescuento === 'porcentaje' && styles.radioOptionActive
                  ]}
                  onPress={() => setFieldValue('tipoDescuento', 'porcentaje')}
                >
                  <Ionicons 
                    name="calculator" 
                    size={16} 
                    color={values.tipoDescuento === 'porcentaje' ? colors.background : colors.primary} 
                  />
                  <Text style={[
                    styles.radioText,
                    values.tipoDescuento === 'porcentaje' && styles.radioTextActive
                  ]}>
                    Porcentaje
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    values.tipoDescuento === 'monto_fijo' && styles.radioOptionActive
                  ]}
                  onPress={() => setFieldValue('tipoDescuento', 'monto_fijo')}
                >
                  <Ionicons 
                    name="cash" 
                    size={16} 
                    color={values.tipoDescuento === 'monto_fijo' ? colors.background : colors.primary} 
                  />
                  <Text style={[
                    styles.radioText,
                    values.tipoDescuento === 'monto_fijo' && styles.radioTextActive
                  ]}>
                    Monto Fijo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    values.tipoDescuento === 'promocion_especial' && styles.radioOptionActive
                  ]}
                  onPress={() => setFieldValue('tipoDescuento', 'promocion_especial')}
                >
                  <Ionicons 
                    name="gift" 
                    size={16} 
                    color={values.tipoDescuento === 'promocion_especial' ? colors.background : colors.primary} 
                  />
                  <Text style={[
                    styles.radioText,
                    values.tipoDescuento === 'promocion_especial' && styles.radioTextActive
                  ]}>
                    Promoción
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Valor del descuento */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Valor del Descuento * 
                {values.tipoDescuento === 'porcentaje' && ' (%)'}
                {values.tipoDescuento === 'monto_fijo' && ' ($)'}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  touched.valorDescuento && errors.valorDescuento && styles.inputError
                ]}
                placeholder={
                  values.tipoDescuento === 'porcentaje' ? '20' :
                  values.tipoDescuento === 'monto_fijo' ? '500' : '50'
                }
                placeholderTextColor={colors.muted}
                value={values.valorDescuento}
                onChangeText={handleChange('valorDescuento')}
                keyboardType="numeric"
              />
              {touched.valorDescuento && errors.valorDescuento && (
                <Text style={styles.errorText}>{errors.valorDescuento}</Text>
              )}
            </View>

            {/* Código del cupón */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Código del Cupón</Text>
              <View style={styles.codeInputContainer}>
                <TextInput
                  style={[styles.input, styles.codeInput]}
                  placeholder="AUTO"
                  placeholderTextColor={colors.muted}
                  value={values.codigoCupon}
                  onChangeText={(text) => setFieldValue('codigoCupon', text.toUpperCase())}
                  maxLength={10}
                />
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={() => setFieldValue('codigoCupon', generateCuponCode(values.titulo || 'CUPON'))}
                >
                  <Ionicons name="refresh" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>
                Deja vacío para generar automáticamente
              </Text>
            </View>

            {/* Fecha de vencimiento */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fecha de Vencimiento *</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.fechaVencimiento && errors.fechaVencimiento && styles.inputError
                ]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.muted}
                value={values.fechaVencimiento}
                onChangeText={handleChange('fechaVencimiento')}
              />
              {touched.fechaVencimiento && errors.fechaVencimiento && (
                <Text style={styles.errorText}>{errors.fechaVencimiento}</Text>
              )}
            </View>

            {/* Límite de canjeos */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Límite de Canjeos</Text>
              <TextInput
                style={styles.input}
                placeholder="100 (opcional)"
                placeholderTextColor={colors.muted}
                value={values.limiteCanjeos}
                onChangeText={handleChange('limiteCanjeos')}
                keyboardType="numeric"
              />
              <Text style={styles.helperText}>
                Deja vacío para canjeos ilimitados
              </Text>
            </View>

            {/* Condiciones */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Términos y Condiciones</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Ej: Válido de lunes a viernes. No acumulable con otras promociones..."
                placeholderTextColor={colors.muted}
                value={values.condiciones}
                onChangeText={handleChange('condiciones')}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
              <Text style={styles.characterCount}>{values.condiciones.length}/200</Text>
            </View>

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
                  styles.createButton,
                  isLoading && styles.createButtonDisabled
                ]}
                onPress={() => {
                  console.log('Botón presionado, isValid:', isValid, 'isLoading:', isLoading);
                  console.log('Errores:', errors);
                  console.log('Valores:', values);
                  
                  // Validar manualmente si es necesario
                  if (!values.titulo.trim()) {
                    Alert.alert('Error', 'El título es requerido');
                    return;
                  }
                  if (!values.descripcion.trim()) {
                    Alert.alert('Error', 'La descripción es requerida');
                    return;
                  }
                  if (!values.valorDescuento) {
                    Alert.alert('Error', 'El valor de descuento es requerido');
                    return;
                  }
                  if (!values.fechaVencimiento) {
                    Alert.alert('Error', 'La fecha de vencimiento es requerida');
                    return;
                  }
                  
                  handleSubmit();
                }}
                disabled={isLoading}
              >
                <Ionicons 
                  name={isLoading ? "hourglass" : "checkmark"} 
                  size={16} 
                  color={colors.background} 
                />
                <Text style={styles.createButtonText}>
                  {isLoading ? 'Creando...' : 'Crear Cupón'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  formContainer: {
    padding: Math.max(16, width * 0.04),
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
    marginTop: sizes.margin.small,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: sizes.margin.small,
  },
  radioOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.background,
    gap: sizes.margin.small,
  },
  radioOptionActive: {
    backgroundColor: colors.primary,
  },
  radioText: {
    fontSize: sizes.small,
    fontWeight: 'bold',
    color: colors.primary,
  },
  radioTextActive: {
    color: colors.background,
  },
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.margin.small,
  },
  codeInput: {
    flex: 1,
  },
  generateButton: {
    padding: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
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
  createButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    backgroundColor: colors.primary,
    gap: sizes.margin.small,
  },
  createButtonDisabled: {
    backgroundColor: colors.muted,
  },
  createButtonText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.background,
  },
});