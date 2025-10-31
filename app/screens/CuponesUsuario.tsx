import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, sizes } from '../../utils';
import { Cupon, cuponesEjemplo } from '../../utils/models';

const { width, height } = Dimensions.get('window');

export default function CuponesUsuario() {
  const [cupones, setCupones] = useState<Cupon[]>(cuponesEjemplo);
  const [cuponesCanjeados, setCuponesCanjeados] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCupon, setSelectedCupon] = useState<Cupon | null>(null);
  const [codigoInput, setCodigoInput] = useState('');

  /**
   * Filtra solo cupones activos y no vencidos
   */
  const cuponesDisponibles = cupones.filter(cupon => {
    const hoy = new Date().toISOString().split('T')[0];
    return cupon.activo && 
           cupon.fechaVencimiento >= hoy && 
           !cuponesCanjeados.includes(cupon.id) &&
           (!cupon.limiteCanjeos || cupon.canjeosActuales < cupon.limiteCanjeos);
  });

  /**
   * Maneja el canje de un cupón
   */
  const handleCanjearCupon = (cupon: Cupon) => {
    setSelectedCupon(cupon);
    setCodigoInput('');
    setModalVisible(true);
  };

  /**
   * Confirma el canje del cupón
   */
  const confirmarCanje = () => {
    if (!selectedCupon) return;

    try {
      // Verificar código si es requerido
      if (selectedCupon.codigoCupon && codigoInput.toUpperCase() !== selectedCupon.codigoCupon) {
        Alert.alert('Código Incorrecto', 'El código ingresado no es válido.');
        return;
      }

      // Agregar a cupones canjeados
      setCuponesCanjeados(prev => [...prev, selectedCupon.id]);
      
      // Incrementar contador de canjeos
      setCupones(prev => 
        prev.map(c => 
          c.id === selectedCupon.id 
            ? { ...c, canjeosActuales: c.canjeosActuales + 1 }
            : c
        )
      );

      setModalVisible(false);
      setSelectedCupon(null);

      Alert.alert(
        '¡Cupón Canjeado!',
        `Has canjeado exitosamente el cupón "${selectedCupon.titulo}". Muestra esta confirmación en el establecimiento.`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Error canjeando cupón:', error);
      Alert.alert('Error', 'No se pudo canjear el cupón. Inténtalo de nuevo.');
    }
  };

  /**
   * Renderiza un cupón disponible
   */
  const renderCuponItem = ({ item }: { item: Cupon }) => {
    const diasRestantes = Math.ceil(
      (new Date(item.fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <TouchableOpacity 
        style={[
          styles.cuponCard,
          { backgroundColor: item.colorFondo || colors.primary }
        ]}
        onPress={() => handleCanjearCupon(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cuponHeader}>
          <View style={styles.cuponTitleContainer}>
            <Text style={[
              styles.cuponTitle,
              { color: item.colorTexto || colors.background }
            ]}>
              {item.titulo}
            </Text>
            <View style={styles.cuponBadge}>
              <Text style={styles.cuponBadgeText}>
                {item.tipoDescuento === 'porcentaje' ? `${item.valorDescuento}%` :
                 item.tipoDescuento === 'monto_fijo' ? `$${item.valorDescuento}` :
                 'Promoción'}
              </Text>
            </View>
          </View>
          <Ionicons 
            name="pricetag" 
            size={24} 
            color={item.colorTexto || colors.background} 
          />
        </View>

        <Text style={[
          styles.cuponDescription,
          { color: item.colorTexto || colors.background }
        ]}>
          {item.descripcion}
        </Text>

        <View style={styles.cuponFooter}>
          <View style={styles.cuponInfo}>
            <View style={styles.cuponInfoItem}>
              <Ionicons 
                name="calendar-outline" 
                size={16} 
                color={item.colorTexto || colors.background} 
              />
              <Text style={[
                styles.cuponInfoText,
                { color: item.colorTexto || colors.background }
              ]}>
                {diasRestantes > 0 ? `${diasRestantes} días restantes` : 'Vence hoy'}
              </Text>
            </View>
            
            {item.limiteCanjeos && (
              <View style={styles.cuponInfoItem}>
                <Ionicons 
                  name="people-outline" 
                  size={16} 
                  color={item.colorTexto || colors.background} 
                />
                <Text style={[
                  styles.cuponInfoText,
                  { color: item.colorTexto || colors.background }
                ]}>
                  {item.limiteCanjeos - item.canjeosActuales} disponibles
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={[
              styles.canjearButton,
              { backgroundColor: item.colorTexto || colors.background }
            ]}
            onPress={() => handleCanjearCupon(item)}
          >
            <Text style={[
              styles.canjearButtonText,
              { color: item.colorFondo || colors.primary }
            ]}>
              Canjear
            </Text>
          </TouchableOpacity>
        </View>

        {/* Patrón decorativo */}
        <View style={styles.cuponPattern}>
          <View style={[
            styles.patternDot,
            { backgroundColor: item.colorTexto || colors.background }
          ]} />
          <View style={[
            styles.patternDot,
            { backgroundColor: item.colorTexto || colors.background }
          ]} />
          <View style={[
            styles.patternDot,
            { backgroundColor: item.colorTexto || colors.background }
          ]} />
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Renderiza el estado vacío
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="pricetag-outline" size={64} color={colors.muted} />
      <Text style={styles.emptyTitle}>No hay cupones disponibles</Text>
      <Text style={styles.emptyText}>
        Los cupones de las empresas aparecerán aquí cuando estén disponibles
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cupones Disponibles</Text>
        <Text style={styles.headerSubtitle}>
          Descuentos y promociones especiales
        </Text>
      </View>

      {/* Lista de cupones */}
      <FlatList
        data={cuponesDisponibles}
        renderItem={renderCuponItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Modal de canje */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Canjear Cupón</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedCupon && (
              <>
                <View style={styles.modalCuponInfo}>
                  <Text style={styles.modalCuponTitle}>{selectedCupon.titulo}</Text>
                  <Text style={styles.modalCuponDescription}>
                    {selectedCupon.descripcion}
                  </Text>
                  
                  {selectedCupon.condiciones && (
                    <View style={styles.modalConditions}>
                      <Text style={styles.modalConditionsTitle}>
                        Términos y condiciones:
                      </Text>
                      <Text style={styles.modalConditionsText}>
                        {selectedCupon.condiciones}
                      </Text>
                    </View>
                  )}
                </View>

                {selectedCupon.codigoCupon && (
                  <View style={styles.modalCodeSection}>
                    <Text style={styles.modalCodeLabel}>
                      Ingresa el código del cupón:
                    </Text>
                    <TextInput
                      style={styles.modalCodeInput}
                      placeholder={`Código: ${selectedCupon.codigoCupon}`}
                      placeholderTextColor={colors.muted}
                      value={codigoInput}
                      onChangeText={setCodigoInput}
                      autoCapitalize="characters"
                      maxLength={10}
                    />
                  </View>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalConfirmButton}
                    onPress={confirmarCanje}
                  >
                    <Text style={styles.modalConfirmButtonText}>
                      Confirmar Canje
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: sizes.padding.large,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: sizes.xlarge,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: sizes.medium,
    color: colors.muted,
    marginTop: 4,
  },
  listContainer: {
    padding: Math.max(16, width * 0.04),
    paddingBottom: sizes.padding.xlarge,
  },
  cuponCard: {
    borderRadius: sizes.borderRadius.large,
    padding: sizes.padding.large,
    marginBottom: sizes.margin.large,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  cuponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: sizes.margin.medium,
  },
  cuponTitleContainer: {
    flex: 1,
  },
  cuponTitle: {
    fontSize: sizes.large,
    fontWeight: 'bold',
    marginBottom: sizes.margin.small,
  },
  cuponBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: sizes.padding.small,
    paddingVertical: 4,
    borderRadius: sizes.borderRadius.small,
  },
  cuponBadgeText: {
    fontSize: sizes.small,
    fontWeight: 'bold',
    color: colors.background,
  },
  cuponDescription: {
    fontSize: sizes.medium,
    lineHeight: 20,
    marginBottom: sizes.margin.large,
  },
  cuponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cuponInfo: {
    flex: 1,
  },
  cuponInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.margin.small,
    marginBottom: sizes.margin.small,
  },
  cuponInfoText: {
    fontSize: sizes.small,
  },
  canjearButton: {
    paddingVertical: sizes.padding.small,
    paddingHorizontal: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
  },
  canjearButtonText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
  },
  cuponPattern: {
    position: 'absolute',
    top: sizes.padding.medium,
    right: sizes.padding.medium,
    flexDirection: 'row',
    gap: 4,
  },
  patternDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.3,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: sizes.padding.xlarge * 2,
  },
  emptyTitle: {
    fontSize: sizes.large,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: sizes.margin.medium,
  },
  emptyText: {
    fontSize: sizes.medium,
    color: colors.muted,
    textAlign: 'center',
    marginTop: sizes.margin.small,
    lineHeight: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: sizes.borderRadius.large,
    padding: sizes.padding.large,
    margin: sizes.margin.large,
    maxWidth: width * 0.9,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.margin.large,
  },
  modalTitle: {
    fontSize: sizes.large,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalCloseButton: {
    padding: sizes.padding.small,
  },
  modalCuponInfo: {
    marginBottom: sizes.margin.large,
  },
  modalCuponTitle: {
    fontSize: sizes.large,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: sizes.margin.small,
  },
  modalCuponDescription: {
    fontSize: sizes.medium,
    color: colors.text,
    lineHeight: 20,
    marginBottom: sizes.margin.medium,
  },
  modalConditions: {
    backgroundColor: colors.surface,
    padding: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
  },
  modalConditionsTitle: {
    fontSize: sizes.small,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.margin.small,
  },
  modalConditionsText: {
    fontSize: sizes.small,
    color: colors.muted,
    lineHeight: 16,
  },
  modalCodeSection: {
    marginBottom: sizes.margin.large,
  },
  modalCodeLabel: {
    fontSize: sizes.medium,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.margin.small,
  },
  modalCodeInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.borderRadius.medium,
    paddingHorizontal: sizes.padding.medium,
    paddingVertical: sizes.padding.medium,
    fontSize: sizes.medium,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: sizes.margin.medium,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.muted,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.muted,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  modalConfirmButtonText: {
    fontSize: sizes.medium,
    fontWeight: 'bold',
    color: colors.background,
  },
});