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
 * Registra el dispositivo para recibir notificaciones push
 * Compatible con Expo SDK 51+
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    let token = null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permisos requeridos',
        'No se pudieron obtener los permisos para notificaciones push.'
      );
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push token:', token);

    return token;
  } catch (error) {
    console.error('Error registrando notificaciones:', error);
    Alert.alert(
      'Error',
      'Hubo un problema al configurar las notificaciones. Inténtalo de nuevo.'
    );
    return null;
  }
}

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
    Alert.alert('Error', 'No se pudo enviar la notificación de prueba.');
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