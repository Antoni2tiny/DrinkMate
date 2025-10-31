import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  FlatList,
} from 'react-native';

const { width, height } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { colors, sizes } from '../../utils';
import { sendTestNotification } from '../../utils/notifications';
import { Cupon, cuponesEjemplo } from '../../utils/models';
import CuponCreator from '../components/CuponCreator';
import { NotificationService } from '../../utils/notificationService';
import { FirestoreCuponService } from '../../utils/firebaseServices';
import { useEmpresaAuth } from '../context/EmpresaAuthContext';

interface NotificationForm {
  title: string;
  message: string;
}

// Esquema de validación para el formulario
const NotificationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(50, 'El título no puede exceder 50 caracteres')
    .required('El título es requerido'),
  message: Yup.string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(200, 'El mensaje no puede exceder 200 caracteres')
    .required('El mensaje es requerido'),
});

export default function EmpresaPanel() {
  const { empresa, isAuthenticated, logoutEmpresa } = useEmpresaAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'notificaciones' | 'cupones'>('notificaciones');
  const [showCuponCreator, setShowCuponCreator] = useState(false);
  const [cupones, setCupones] = useState<Cupon[]>([]);
  const [loadingCupones, setLoadingCupones] = useState(true);
  const empresaId = empresa?.id || '1'; // ID de la empresa actual

  /**
   * Cargar cupones desde Firebase al iniciar
   */
  useEffect(() => {
    loadCuponesFromFirebase();
  }, []);

  /**
   * Cargar cupones desde Firebase
   */
  const loadCuponesFromFirebase = async () => {
    try {
      setLoadingCupones(true);
      console.log('🔄 Cargando cupones desde Firebase...');
      
      const firebaseCupones = await FirestoreCuponService.getCuponesByEmpresa(empresaId);
      
      if (firebaseCupones.length > 0) {
        console.log(`✅ ${firebaseCupones.length} cupones cargados desde Firebase`);
        setCupones(firebaseCupones);
      } else {
        console.log('📝 No hay cupones en Firebase, usando datos de ejemplo');
        // Si no hay cupones en Firebase, usar los de ejemplo como fallback
        setCupones(cuponesEjemplo);
      }
    } catch (error) {
      console.error('❌ Error cargando cupones desde Firebase:', error);
      // En caso de error, usar cupones de ejemplo
      setCupones(cuponesEjemplo);
    } finally {
      setLoadingCupones(false);
    }
  };

  /**
   * Maneja el envío del formulario de notificación
   */
  const handleSendNotification = async (values: NotificationForm, { resetForm }: any) => {
    try {
      setIsLoading(true);

      // Validar campos antes de enviar
      if (!values.title.trim() || !values.message.trim()) {
        Alert.alert('Error', 'Por favor completa todos los campos.');
        return;
      }

      // Enviar notificación usando el nuevo servicio
      await NotificationService.sendFromEmpresa(
        values.title.trim(), 
        values.message.trim(), 
        '1' // ID de la empresa actual
      );

      // Mostrar confirmación
      Alert.alert(
        'Notificación Enviada',
        `Se ha enviado la notificación "${values.title}" correctamente. Los usuarios la verán en su perfil.`,
        [
          {
            text: 'OK',
            onPress: () => resetForm(),
          },
        ]
      );

      console.log('Notificación enviada:', {
        title: values.title,
        message: values.message,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Error enviando notificación:', error);
      Alert.alert(
        'Error',
        'Hubo un problema al enviar la notificación. Por favor inténtalo de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja la vista previa de la notificación
   */
  const handlePreviewNotification = (values: NotificationForm) => {
    try {
      if (!values.title.trim() || !values.message.trim()) {
        Alert.alert('Error', 'Por favor completa todos los campos para la vista previa.');
        return;
      }

      Alert.alert(
        'Vista Previa de Notificación',
        `Título: ${values.title}\n\nMensaje: ${values.message}`,
        [
          { text: 'Cerrar', style: 'cancel' },
          { 
            text: 'Enviar Ahora', 
            onPress: () => sendTestNotification(values.title, values.message)
          },
        ]
      );
    } catch (error) {
      console.error('Error en vista previa:', error);
      Alert.alert('Error', 'No se pudo mostrar la vista previa.');
    }
  };

  /**
   * Maneja la creación de un nuevo cupón
   */
  const handleCuponCreated = async (nuevoCupon: Partial<Cupon>) => {
    try {
      console.log('🎫 Creando nuevo cupón:', nuevoCupon.titulo);
      
      // Intentar guardar en Firebase primero
      const firebaseId = await FirestoreCuponService.createCupon({
        ...nuevoCupon,
        empresaId,
      } as Omit<Cupon, 'id'>);
      
      const cuponCompleto: Cupon = {
        id: firebaseId || Date.now().toString(),
        empresaId,
        ...nuevoCupon,
      } as Cupon;

      // Actualizar la lista local
      setCupones(prev => [cuponCompleto, ...prev]);
      setShowCuponCreator(false);
      
      // Enviar notificación a usuarios
      await NotificationService.sendCuponNotification(
        '🎫 ¡Nuevo cupón disponible!',
        `${nuevoCupon.titulo} - ${nuevoCupon.descripcion}`,
        cuponCompleto.id,
        empresaId
      );
      
      const mensaje = firebaseId 
        ? '✅ Cupón creado y guardado en Firebase. Los usuarios han sido notificados.'
        : '⚠️ Cupón creado localmente (Firebase no disponible). Los usuarios han sido notificados.';
      
      Alert.alert('Éxito', mensaje);
      
      // Recargar cupones desde Firebase para asegurar sincronización
      if (firebaseId) {
        setTimeout(() => loadCuponesFromFirebase(), 1000);
      }
      
    } catch (error) {
      console.error('❌ Error creando cupón:', error);
      Alert.alert('Error', 'No se pudo crear el cupón. Inténtalo de nuevo.');
    }
  };

  /**
   * Maneja la activación/desactivación de cupones
   */
  const toggleCuponStatus = async (cuponId: string) => {
    try {
      const cupon = cupones.find(c => c.id === cuponId);
      if (!cupon) return;

      const nuevoEstado = !cupon.activo;
      
      // Actualizar en Firebase
      const success = await FirestoreCuponService.updateCupon(cuponId, { 
        activo: nuevoEstado 
      });
      
      if (success) {
        // Actualizar localmente solo si Firebase fue exitoso
        setCupones(prev => 
          prev.map(c => 
            c.id === cuponId 
              ? { ...c, activo: nuevoEstado }
              : c
          )
        );
        
        console.log(`✅ Cupón ${nuevoEstado ? 'activado' : 'desactivado'}: ${cupon.titulo}`);
        
        // Notificar a usuarios si se activa un cupón
        if (nuevoEstado) {
          await NotificationService.sendCuponNotification(
            '🔄 Cupón reactivado',
            `${cupon.titulo} está disponible nuevamente`,
            cuponId,
            empresaId
          );
        }
      } else {
        Alert.alert('Error', 'No se pudo actualizar el estado del cupón');
      }
    } catch (error) {
      console.error('❌ Error cambiando estado del cupón:', error);
      Alert.alert('Error', 'No se pudo cambiar el estado del cupón');
    }
  };

  /**
   * Eliminar un cupón
   */
  const deleteCupon = async (cuponId: string, titulo: string) => {
    Alert.alert(
      'Eliminar Cupón',
      `¿Estás seguro de que quieres eliminar "${titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await FirestoreCuponService.deleteCupon(cuponId);
              
              if (success) {
                setCupones(prev => prev.filter(c => c.id !== cuponId));
                console.log('✅ Cupón eliminado:', titulo);
              } else {
                Alert.alert('Error', 'No se pudo eliminar el cupón');
              }
            } catch (error) {
              console.error('❌ Error eliminando cupón:', error);
              Alert.alert('Error', 'No se pudo eliminar el cupón');
            }
          }
        }
      ]
    );
  };

  /**
   * Renderiza un item de cupón
   */
  const renderCuponItem = ({ item }: { item: Cupon }) => (
    <View style={styles.cuponCard}>
      <View style={styles.cuponHeader}>
        <Text style={styles.cuponTitle}>{item.titulo}</Text>
        <View style={styles.cuponActions}>
          <TouchableOpacity
            style={[
              styles.cuponStatusButton,
              item.activo ? styles.cuponActiveButton : styles.cuponInactiveButton
            ]}
            onPress={() => toggleCuponStatus(item.id)}
          >
            <Text style={[
              styles.cuponStatusText,
              item.activo ? styles.cuponActiveText : styles.cuponInactiveText
            ]}>
              {item.activo ? 'Activo' : 'Inactivo'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteCupon(item.id, item.titulo)}
          >
            <Ionicons name="trash-outline" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.cuponDescription}>{item.descripcion}</Text>
      
      <View style={styles.cuponDetails}>
        <View style={styles.cuponDetailItem}>
          <Ionicons name="pricetag" size={16} color={colors.primary} />
          <Text style={styles.cuponDetailText}>
            {item.tipoDescuento === 'porcentaje' ? `${item.valorDescuento}%` :
             item.tipoDescuento === 'monto_fijo' ? `$${item.valorDescuento}` :
             'Promoción especial'}
          </Text>
        </View>
        
        <View style={styles.cuponDetailItem}>
          <Ionicons name="calendar" size={16} color={colors.muted} />
          <Text style={styles.cuponDetailText}>
            Hasta {item.fechaVencimiento}
          </Text>
        </View>
        
        <View style={styles.cuponDetailItem}>
          <Ionicons name="people" size={16} color={colors.success} />
          <Text style={styles.cuponDetailText}>
            {item.canjeosActuales}/{item.limiteCanjeos || '∞'} canjes
          </Text>
        </View>
      </View>
      
      {item.codigoCupon && (
        <View style={styles.cuponCode}>
          <Text style={styles.cuponCodeLabel}>Código:</Text>
          <Text style={styles.cuponCodeText}>{item.codigoCupon}</Text>
        </View>
      )}
    </View>
  );

  // Mostrar el creador de cupones si está activo
  if (showCuponCreator) {
    return (
      <CuponCreator
        onCuponCreated={handleCuponCreated}
        onCancel={() => setShowCuponCreator(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="business" size={32} color={colors.darkText} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>
              {empresa?.nombre || 'Panel de Empresa'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {empresa?.tipo || 'Gestiona tu negocio'} 
              {isAuthenticated && ' • Autenticado'}
            </Text>
          </View>
          {isAuthenticated && (
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={() => {
                Alert.alert(
                  'Cerrar Sesión',
                  '¿Estás seguro de que quieres cerrar sesión?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { 
                      text: 'Cerrar Sesión', 
                      style: 'destructive',
                      onPress: logoutEmpresa 
                    },
                  ]
                );
              }}
            >
              <Ionicons name="log-out" size={24} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>

        {/* Pestañas de navegación */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'notificaciones' && styles.tabButtonActive
            ]}
            onPress={() => setActiveTab('notificaciones')}
          >
            <Ionicons 
              name="notifications" 
              size={20} 
              color={activeTab === 'notificaciones' ? colors.darkText : colors.muted} 
            />
            <Text style={[
              styles.tabButtonText,
              activeTab === 'notificaciones' && styles.tabButtonTextActive
            ]}>
              Notificaciones
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'cupones' && styles.tabButtonActive
            ]}
            onPress={() => setActiveTab('cupones')}
          >
            <Ionicons 
              name="pricetag" 
              size={20} 
              color={activeTab === 'cupones' ? colors.darkText : colors.muted} 
            />
            <Text style={[
              styles.tabButtonText,
              activeTab === 'cupones' && styles.tabButtonTextActive
            ]}>
              Cupones
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenido según la pestaña activa */}
        {activeTab === 'notificaciones' ? (
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >

          {/* Formulario */}
          <Formik
            initialValues={{ title: '', message: '' }}
            validationSchema={NotificationSchema}
            onSubmit={handleSendNotification}
          >
            {({ values, handleChange, handleSubmit, errors, touched, isValid }) => (
              <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Nueva Notificación</Text>

                {/* Campo Título */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Título de la Notificación</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.title && errors.title ? styles.inputError : null
                    ]}
                    placeholder="Ej: Nueva promoción disponible"
                    placeholderTextColor={colors.muted}
                    value={values.title}
                    onChangeText={handleChange('title')}
                    maxLength={50}
                    autoCapitalize="sentences"
                  />
                  <Text style={styles.characterCount}>{values.title.length}/50</Text>
                  {touched.title && errors.title && (
                    <Text style={styles.errorText}>{errors.title}</Text>
                  )}
                </View>

                {/* Campo Mensaje */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Mensaje de la Notificación</Text>
                  <TextInput
                    style={[
                      styles.textArea,
                      touched.message && errors.message ? styles.inputError : null
                    ]}
                    placeholder="Escribe aquí el mensaje completo de la notificación..."
                    placeholderTextColor={colors.muted}
                    value={values.message}
                    onChangeText={handleChange('message')}
                    maxLength={200}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    autoCapitalize="sentences"
                  />
                  <Text style={styles.characterCount}>{values.message.length}/200</Text>
                  {touched.message && errors.message && (
                    <Text style={styles.errorText}>{errors.message}</Text>
                  )}
                </View>

                {/* Botones de acción */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.previewButton, !isValid && styles.buttonDisabled]}
                    onPress={() => handlePreviewNotification(values)}
                    disabled={!isValid || isLoading}
                  >
                    <Ionicons name="eye-outline" size={20} color={colors.darkText} />
                    <Text style={styles.previewButtonText}>Vista Previa</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.sendButton,
                      (!isValid || isLoading) && styles.buttonDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={!isValid || isLoading}
                  >
                    <Ionicons 
                      name={isLoading ? "hourglass-outline" : "send"} 
                      size={20} 
                      color={colors.darkText} 
                    />
                    <Text style={styles.sendButtonText}>
                      {isLoading ? 'Enviando...' : 'Enviar Notificación'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>

            {/* Información adicional */}
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Información</Text>
              <View style={styles.infoCard}>
                <Ionicons name="information-circle" size={20} color={colors.primary} />
                <Text style={styles.infoText}>
                  Las notificaciones se enviarán como notificaciones locales de prueba. 
                  En un entorno de producción, estas se enviarían a través de un servidor 
                  de notificaciones push.
                </Text>
              </View>
              
              {/* Botones de prueba */}
              <View style={styles.testButtonsContainer}>
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => NotificationService.simulateServerNotifications()}
                >
                  <Ionicons name="flash" size={16} color={colors.darkText} />
                  <Text style={styles.testButtonText}>Simular Notificaciones</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={loadCuponesFromFirebase}
                >
                  <Ionicons name="cloud-download" size={16} color={colors.darkText} />
                  <Text style={styles.testButtonText}>Sincronizar Firebase</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        ) : (
          /* Pestaña de Cupones */
          <View style={styles.cuponesContainer}>
            {/* Header de cupones */}
            <View style={styles.cuponesHeader}>
              <View style={styles.cuponesHeaderLeft}>
                <Text style={styles.cuponesTitle}>Mis Cupones</Text>
                {loadingCupones && (
                  <Text style={styles.loadingText}>Cargando...</Text>
                )}
              </View>
              <View style={styles.cuponesHeaderButtons}>
                <TouchableOpacity
                  style={styles.syncButton}
                  onPress={loadCuponesFromFirebase}
                  disabled={loadingCupones}
                >
                  <Ionicons 
                    name={loadingCupones ? "hourglass" : "refresh"} 
                    size={18} 
                    color={colors.darkText} 
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.createCuponButton}
                  onPress={() => setShowCuponCreator(true)}
                >
                  <Ionicons name="add" size={20} color={colors.darkText} />
                  <Text style={styles.createCuponButtonText}>Crear Cupón</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Lista de cupones */}
            {cupones.length > 0 ? (
              <FlatList
                data={cupones}
                renderItem={renderCuponItem}
                keyExtractor={(item) => item.id}
                style={styles.cuponesList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.cuponesListContent}
              />
            ) : (
              <View style={styles.emptyCupones}>
                <Ionicons name="pricetag-outline" size={64} color={colors.muted} />
                <Text style={styles.emptyCuponesTitle}>No tienes cupones</Text>
                <Text style={styles.emptyCuponesText}>
                  Crea tu primer cupón para atraer más clientes
                </Text>
                <TouchableOpacity
                  style={styles.createFirstCuponButton}
                  onPress={() => setShowCuponCreator(true)}
                >
                  <Text style={styles.createFirstCuponButtonText}>Crear mi primer cupón</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: sizes.padding.xlarge,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: sizes.padding.large,
    backgroundColor: colors.darkSurface,
    marginBottom: sizes.margin.medium,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: sizes.margin.medium,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: sizes.xlarge,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  headerSubtitle: {
    fontSize: sizes.medium,
    color: colors.muted,
    marginTop: 2,
  },
  logoutButton: {
    padding: sizes.padding.small,
    borderRadius: sizes.borderRadius.small,
    backgroundColor: colors.darkBackground,
  },
  formContainer: {
    marginHorizontal: Math.max(12, width * 0.03),
    backgroundColor: colors.darkSurface,
    borderRadius: sizes.borderRadius.medium,
    padding: Math.max(16, width * 0.04),
    marginBottom: sizes.margin.medium,
  },
  sectionTitle: {
    fontSize: sizes.large,
    fontWeight: 'bold',
    color: colors.darkText,
    marginBottom: sizes.margin.large,
  },
  inputContainer: {
    marginBottom: sizes.margin.large,
  },
  inputLabel: {
    fontSize: sizes.medium,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: sizes.margin.small,
  },
  input: {
    backgroundColor: colors.darkBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.borderRadius.medium,
    paddingHorizontal: sizes.padding.medium,
    paddingVertical: sizes.padding.medium,
    fontSize: sizes.medium,
    color: colors.darkText,
    minHeight: sizes.inputHeight,
  },
  textArea: {
    backgroundColor: colors.darkBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.borderRadius.medium,
    paddingHorizontal: sizes.padding.medium,
    paddingVertical: sizes.padding.medium,
    fontSize: sizes.medium,
    color: colors.darkText,
    minHeight: 100,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: sizes.margin.medium,
    marginTop: sizes.margin.medium,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.muted,
    paddingVertical: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    gap: sizes.margin.small,
  },
  previewButtonText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  sendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    gap: sizes.margin.small,
  },
  sendButtonText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  infoSection: {
    marginHorizontal: Math.max(12, width * 0.03),
  },
  infoTitle: {
    fontSize: sizes.large,
    fontWeight: 'bold',
    color: colors.darkText,
    marginBottom: sizes.margin.medium,
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
  // Estilos para pestañas
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.darkSurface,
    marginHorizontal: Math.max(12, width * 0.03),
    borderRadius: sizes.borderRadius.medium,
    padding: 4,
    marginBottom: sizes.margin.medium,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sizes.padding.medium,
    borderRadius: sizes.borderRadius.small,
    gap: sizes.margin.small,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: sizes.medium,
    fontWeight: '600',
    color: colors.muted,
  },
  tabButtonTextActive: {
    color: colors.darkText,
  },
  // Estilos para cupones
  cuponesContainer: {
    flex: 1,
    paddingHorizontal: Math.max(12, width * 0.03),
  },
  cuponesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.margin.large,
  },
  cuponesHeaderLeft: {
    flex: 1,
  },
  cuponesHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.margin.small,
  },
  loadingText: {
    fontSize: sizes.small,
    color: colors.muted,
    marginTop: 2,
  },
  syncButton: {
    padding: sizes.padding.small,
    borderRadius: sizes.borderRadius.small,
    backgroundColor: colors.muted,
    opacity: 0.8,
  },
  cuponesTitle: {
    fontSize: sizes.xlarge,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  createCuponButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: sizes.padding.small,
    paddingHorizontal: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    gap: sizes.margin.small,
  },
  createCuponButtonText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  cuponesList: {
    flex: 1,
  },
  cuponesListContent: {
    paddingBottom: sizes.padding.xlarge,
  },
  cuponCard: {
    backgroundColor: colors.darkSurface,
    borderRadius: sizes.borderRadius.medium,
    padding: sizes.padding.large,
    marginBottom: sizes.margin.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cuponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.margin.small,
  },
  cuponActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.margin.small,
  },
  deleteButton: {
    padding: 4,
    borderRadius: sizes.borderRadius.small,
    backgroundColor: colors.surface,
  },
  cuponTitle: {
    fontSize: sizes.large,
    fontWeight: 'bold',
    color: colors.darkText,
    flex: 1,
  },
  cuponStatusButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: sizes.borderRadius.small,
  },
  cuponActiveButton: {
    backgroundColor: colors.success,
  },
  cuponInactiveButton: {
    backgroundColor: colors.muted,
  },
  cuponStatusText: {
    fontSize: sizes.small,
    fontWeight: 'bold',
  },
  cuponActiveText: {
    color: colors.darkText,
  },
  cuponInactiveText: {
    color: colors.darkText,
  },
  cuponDescription: {
    fontSize: sizes.medium,
    color: colors.muted,
    marginBottom: sizes.margin.medium,
    lineHeight: 20,
  },
  cuponDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: sizes.margin.medium,
    marginBottom: sizes.margin.medium,
  },
  cuponDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.margin.small,
  },
  cuponDetailText: {
    fontSize: sizes.small,
    color: colors.darkText,
  },
  cuponCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkBackground,
    padding: sizes.padding.small,
    borderRadius: sizes.borderRadius.small,
    gap: sizes.margin.small,
  },
  cuponCodeLabel: {
    fontSize: sizes.small,
    color: colors.muted,
  },
  cuponCodeText: {
    fontSize: sizes.small,
    fontWeight: 'bold',
    color: colors.primary,
  },
  emptyCupones: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: sizes.padding.xlarge,
  },
  emptyCuponesTitle: {
    fontSize: sizes.large,
    fontWeight: 'bold',
    color: colors.darkText,
    marginTop: sizes.margin.medium,
  },
  emptyCuponesText: {
    fontSize: sizes.medium,
    color: colors.muted,
    textAlign: 'center',
    marginTop: sizes.margin.small,
    marginBottom: sizes.margin.large,
  },
  createFirstCuponButton: {
    backgroundColor: colors.primary,
    paddingVertical: sizes.padding.medium,
    paddingHorizontal: sizes.padding.large,
    borderRadius: sizes.borderRadius.medium,
  },
  createFirstCuponButtonText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  testButtonsContainer: {
    flexDirection: 'row',
    gap: sizes.margin.small,
    marginTop: sizes.margin.medium,
  },
  testButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.muted,
    paddingVertical: sizes.padding.small,
    paddingHorizontal: sizes.padding.small,
    borderRadius: sizes.borderRadius.small,
    gap: sizes.margin.small,
  },
  testButtonText: {
    fontSize: sizes.small,
    fontWeight: '600',
    color: colors.darkText,
  },
}); 