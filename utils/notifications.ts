import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

// Configuración de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Envía una notificación local de prueba
 */
export async function sendTestNotification(title: string, body: string): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { testNotification: true },
      },
      trigger: { seconds: 1 },
    });
  } catch (error) {
    console.error('Error enviando notificación de prueba:', error);
  }
}

/**
 * Cancela todas las notificaciones programadas
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error cancelando notificaciones:', error);
  }
}