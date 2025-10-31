import { 
  getMessaging, 
  getToken, 
  onMessage,
  isSupported
} from 'firebase/messaging';
import { firebaseApp } from './initFirebase';

// Inicializar Messaging (solo si está soportado)
let messaging: any = null;

const initMessaging = async () => {
  if (!firebaseApp) return null;
  
  try {
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(firebaseApp);
      return messaging;
    }
  } catch (error) {
    console.log('Firebase Messaging no soportado en este entorno');
  }
  return null;
};

/**
 * Servicio de Push Notifications con Firebase Cloud Messaging
 */
export class FirebasePushService {
  
  /**
   * Inicializar y obtener token de FCM
   */
  static async initialize(): Promise<string | null> {
    try {
      await initMessaging();
      
      if (!messaging) {
        console.log('Firebase Messaging no disponible');
        return null;
      }

      // Solicitar permisos de notificación
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Obtener token de registro
        const token = await getToken(messaging, {
          vapidKey: 'YOUR_VAPID_KEY' // Necesitas configurar esto en Firebase
        });
        
        console.log('✅ Token FCM obtenido:', token);
        return token;
      } else {
        console.log('❌ Permisos de notificación denegados');
        return null;
      }
    } catch (error) {
      console.error('❌ Error inicializando FCM:', error);
      return null;
    }
  }

  /**
   * Escuchar mensajes en primer plano
   */
  static onForegroundMessage(callback: (payload: any) => void): (() => void) | null {
    if (!messaging) return null;

    try {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('📱 Mensaje recibido en primer plano:', payload);
        callback(payload);
      });

      return unsubscribe;
    } catch (error) {
      console.error('❌ Error configurando listener de mensajes:', error);
      return null;
    }
  }

  /**
   * Enviar token al servidor (para guardar en Firestore)
   */
  static async saveTokenToFirestore(token: string, userId: string): Promise<boolean> {
    // Aquí integrarías con tu servicio de Firestore
    // para guardar el token asociado al usuario
    try {
      // Ejemplo de implementación:
      /*
      await FirestoreCuponService.updateUserToken(userId, token);
      */
      console.log('Token guardado para usuario:', userId);
      return true;
    } catch (error) {
      console.error('❌ Error guardando token:', error);
      return false;
    }
  }
}

/**
 * Configuración para React Native (Expo)
 * Nota: Para React Native necesitarás configuración adicional
 */
export class ExpoFirebasePushService {
  
  /**
   * Configurar notificaciones para Expo
   */
  static async setupExpoNotifications(): Promise<void> {
    // Para Expo necesitarías:
    // 1. Configurar firebase-admin en tu servidor
    // 2. Usar Expo's push notification service
    // 3. Integrar ambos servicios
    
    console.log('🚧 Configuración de Expo + Firebase en desarrollo');
    
    // Ejemplo de integración:
    /*
    import * as Notifications from 'expo-notifications';
    import Constants from 'expo-constants';
    
    // Configurar handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    
    // Obtener token de Expo
    const expoPushToken = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });
    
    // Enviar token a tu servidor Firebase
    await this.sendTokenToFirebaseServer(expoPushToken.data);
    */
  }
}