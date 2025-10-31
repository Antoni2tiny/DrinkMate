import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, sizes } from '../../utils';
import { NotificationService, UserNotification } from '../../utils/notificationService';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function NotificacionesUsuario() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  /**
   * Carga las notificaciones del usuario
   */
  const loadNotifications = useCallback(async () => {
    try {
      const userNotifications = await NotificationService.getUserNotifications();
      setNotifications(userNotifications);
      
      const unread = await NotificationService.getUnreadCount();
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las notificaciones.');
    }
  }, []);

  /**
   * Refresca las notificaciones
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  }, [loadNotifications]);

  /**
   * Marca una notificación como leída
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      await loadNotifications(); // Recargar para actualizar el estado
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  }, [loadNotifications]);

  /**
   * Marca todas las notificaciones como leídas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await NotificationService.markAllAsRead();
      await loadNotifications();
      Alert.alert('Éxito', 'Todas las notificaciones han sido marcadas como leídas.');
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
      Alert.alert('Error', 'No se pudieron marcar las notificaciones como leídas.');
    }
  }, [loadNotifications]);

  /**
   * Elimina una notificación
   */
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      Alert.alert(
        'Eliminar Notificación',
        '¿Estás seguro de que quieres eliminar esta notificación?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              await NotificationService.deleteNotification(notificationId);
              await loadNotifications();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error eliminando notificación:', error);
      Alert.alert('Error', 'No se pudo eliminar la notificación.');
    }
  }, [loadNotifications]);

  // Cargar notificaciones al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  /**
   * Obtiene el icono según el tipo de notificación
   */
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'empresa':
        return 'business';
      case 'cupon':
        return 'pricetag';
      case 'sistema':
        return 'settings';
      default:
        return 'notifications';
    }
  };

  /**
   * Obtiene el color según el tipo de notificación
   */
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'empresa':
        return colors.primary;
      case 'cupon':
        return colors.success;
      case 'sistema':
        return colors.warning;
      default:
        return colors.muted;
    }
  };

  /**
   * Formatea la fecha de la notificación
   */
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `Hace ${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `Hace ${Math.floor(diffInHours)} h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
  };

  /**
   * Renderiza un item de notificación
   */
  const renderNotificationItem = ({ item }: { item: UserNotification }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.read && styles.notificationCardUnread
      ]}
      onPress={() => !item.read && markAsRead(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIcon}>
          <Ionicons 
            name={getNotificationIcon(item.type)} 
            size={20} 
            color={getNotificationColor(item.type)} 
          />
        </View>
        
        <View style={styles.notificationContent}>
          <Text style={[
            styles.notificationTitle,
            !item.read && styles.notificationTitleUnread
          ]}>
            {item.title}
          </Text>
          <Text style={styles.notificationMessage}>
            {item.message}
          </Text>
          <Text style={styles.notificationTime}>
            {formatDate(item.timestamp)}
          </Text>
        </View>

        <View style={styles.notificationActions}>
          {!item.read && (
            <View style={styles.unreadIndicator} />
          )}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteNotification(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color={colors.muted} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  /**
   * Renderiza el estado vacío
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-outline" size={64} color={colors.muted} />
      <Text style={styles.emptyTitle}>No tienes notificaciones</Text>
      <Text style={styles.emptyText}>
        Las notificaciones de empresas y cupones aparecerán aquí
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        {notifications.length > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Ionicons name="checkmark-done" size={20} color={colors.primary} />
            <Text style={styles.markAllButtonText}>Marcar todas</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de notificaciones */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: sizes.padding.large,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.margin.small,
  },
  headerTitle: {
    fontSize: sizes.xlarge,
    fontWeight: 'bold',
    color: colors.text,
  },
  unreadBadge: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontSize: sizes.small,
    fontWeight: 'bold',
    color: colors.background,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.margin.small,
    paddingVertical: sizes.padding.small,
    paddingHorizontal: sizes.padding.medium,
    borderRadius: sizes.borderRadius.medium,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  markAllButtonText: {
    fontSize: sizes.small,
    fontWeight: 'bold',
    color: colors.primary,
  },
  listContainer: {
    padding: Math.max(16, width * 0.04),
    paddingBottom: sizes.padding.xlarge,
  },
  notificationCard: {
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.medium,
    padding: sizes.padding.medium,
    marginBottom: sizes.margin.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notificationCardUnread: {
    backgroundColor: `${colors.primary}08`,
    borderColor: `${colors.primary}30`,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: sizes.margin.medium,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: sizes.medium,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.margin.small,
  },
  notificationTitleUnread: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  notificationMessage: {
    fontSize: sizes.small,
    color: colors.muted,
    lineHeight: 18,
    marginBottom: sizes.margin.small,
  },
  notificationTime: {
    fontSize: sizes.small,
    color: colors.muted,
    fontStyle: 'italic',
  },
  notificationActions: {
    alignItems: 'center',
    gap: sizes.margin.small,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  deleteButton: {
    padding: sizes.padding.small,
    borderRadius: sizes.borderRadius.small,
    backgroundColor: colors.surface,
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
    paddingHorizontal: sizes.padding.large,
  },
});