import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'empresa' | 'sistema' | 'cupon';
  empresaId?: string;
  cuponId?: string;
}

const NOTIFICATIONS_KEY = 'user_notifications';

/**
 * Servicio para manejar notificaciones del usuario
 */
export class NotificationService {
  
  /**
   * Obtiene todas las notificaciones del usuario
   */
  static async getUserNotifications(): Promise<UserNotification[]> {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      return [];
    }
  }

  /**
   * Agrega una nueva notificación
   */
  static async addNotification(notification: Omit<UserNotification, 'id' | 'timestamp' | 'read'>): Promise<void> {
    try {
      const notifications = await this.getUserNotifications();
      
      const newNotification: UserNotification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };

      notifications.unshift(newNotification); // Agregar al inicio
      
      // Mantener solo las últimas 50 notificaciones
      const limitedNotifications = notifications.slice(0, 50);
      
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(limitedNotifications));
      
      // Enviar notificación local
      await this.sendLocalNotification(newNotification);
      
    } catch (error) {
      console.error('Error agregando notificación:', error);
    }
  }

  /**
   * Marca una notificación como leída
   */
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getUserNotifications();
      const updatedNotifications = notifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    }
  }

  /**
   * Marca todas las notificaciones como leídas
   */
  static async markAllAsRead(): Promise<void> {
    try {
      const notifications = await this.getUserNotifications();
      const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
      
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marcando todas las notificaciones como leídas:', error);
    }
  }

  /**
   * Obtiene el número de notificaciones no leídas
   */
  static async getUnreadCount(): Promise<number> {
    try {
      const notifications = await this.getUserNotifications();
      return notifications.filter(notif => !notif.read).length;
    } catch (error) {
      console.error('Error obteniendo contador de no leídas:', error);
      return 0;
    }
  }

  /**
   * Elimina una notificación
   */
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getUserNotifications();
      const filteredNotifications = notifications.filter(notif => notif.id !== notificationId);
      
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filteredNotifications));
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    }
  }

  /**
   * Limpia todas las notificaciones
   */
  static async clearAllNotifications(): Promise<void> {
    try {
      await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
    } catch (error) {
      console.error('Error limpiando notificaciones:', error);
    }
  }

  /**
   * Envía una notificación local
   */
  private static async sendLocalNotification(notification: UserNotification): Promise<void> {
    try {
      // Configurar el comportamiento de las notificaciones (solo locales en Expo Go)
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true, // Usar shouldShowAlert en lugar de shouldShowBanner para compatibilidad
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Solicitar permisos si no los tenemos
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === 'granted') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: notification.message,
            data: {
              notificationId: notification.id,
              type: notification.type,
              empresaId: notification.empresaId,
              cuponId: notification.cuponId,
            },
          },
          trigger: { seconds: 2 }, // Pequeño delay para mejor UX
        });
        console.log('✅ Notificación local enviada:', notification.title);
      } else {
        console.log('⚠️ Permisos de notificación denegados');
      }
    } catch (error) {
      // Silenciar errores específicos de Expo Go
      if (error.message && (error.message.includes('projectId') || error.message.includes('Expo token'))) {
        console.log('📱 Notificación guardada (Expo Go - sin push notifications)');
      } else {
        console.log('📱 Notificación guardada (modo desarrollo):', notification.title);
      }
    }
  }

  /**
   * Simula el envío de una notificación desde una empresa
   */
  static async sendFromEmpresa(title: string, message: string, empresaId: string = '1'): Promise<void> {
    await this.addNotification({
      title,
      message,
      type: 'empresa',
      empresaId,
    });
  }

  /**
   * Simula el envío de una notificación de cupón
   */
  static async sendCuponNotification(title: string, message: string, cuponId: string, empresaId: string = '1'): Promise<void> {
    await this.addNotification({
      title,
      message,
      type: 'cupon',
      empresaId,
      cuponId,
    });
  }

  /**
   * Simula notificaciones automáticas del "servidor" (para testing)
   */
  static async simulateServerNotifications(): Promise<void> {
    const notifications = [
      {
        title: '🎉 ¡Bienvenido a DrinkMate!',
        message: 'Descubre los mejores bares y promociones cerca de ti',
        type: 'sistema' as const,
      },
      {
        title: '🍹 Happy Hour',
        message: 'Bar Central tiene 2x1 en cócteles hasta las 8 PM',
        type: 'empresa' as const,
        empresaId: '1',
      },
      {
        title: '🎫 Nuevo cupón disponible',
        message: '30% OFF en tu próxima visita a Rooftop Lounge',
        type: 'cupon' as const,
        empresaId: '2',
        cuponId: 'test-cupon-1',
      },
    ];

    // Enviar notificaciones con delay para simular servidor
    for (let i = 0; i < notifications.length; i++) {
      setTimeout(async () => {
        await this.addNotification(notifications[i]);
      }, (i + 1) * 3000); // Una cada 3 segundos
    }
  }

  /**
   * Programa una notificación para más tarde (simula push programado)
   */
  static async scheduleDelayedNotification(
    title: string, 
    message: string, 
    delaySeconds: number,
    type: 'empresa' | 'sistema' | 'cupon' = 'sistema'
  ): Promise<void> {
    setTimeout(async () => {
      await this.addNotification({
        title,
        message,
        type,
      });
    }, delaySeconds * 1000);
    
    console.log(`📅 Notificación programada para ${delaySeconds} segundos: ${title}`);
  }
}