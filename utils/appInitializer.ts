import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

/**
 * Inicializador de la aplicación
 * Configura servicios y permisos necesarios
 */
export class AppInitializer {
  
  /**
   * Inicializar notificaciones locales
   */
  static async initializeNotifications(): Promise<void> {
    try {
      // Configurar el manejador de notificaciones
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Solicitar permisos de notificación
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('⚠️ Permisos de notificación denegados');
        return;
      }

      console.log('✅ Notificaciones locales configuradas correctamente');
    } catch (error) {
      // Silenciar errores de notificaciones en desarrollo
      if (error.message && error.message.includes('projectId')) {
        console.log('📱 Notificaciones push no disponibles en Expo Go (normal en desarrollo)');
      } else {
        console.log('📱 Notificaciones no disponibles:', error.message);
      }
    }
  }

  /**
   * Verificar estado de Firebase
   */
  static checkFirebaseStatus(): boolean {
    try {
      const { firebaseApp } = require('./initFirebase');
      if (firebaseApp) {
        console.log('✅ Firebase conectado correctamente');
        return true;
      } else {
        console.log('⚠️ Firebase no configurado - usando modo offline');
        return false;
      }
    } catch (error) {
      console.log('❌ Error verificando Firebase:', error);
      return false;
    }
  }

  /**
   * Inicializar toda la aplicación
   */
  static async initializeApp(): Promise<void> {
    console.log('🚀 Inicializando DrinkMate...');
    
    // Verificar Firebase
    this.checkFirebaseStatus();
    
    // Configurar notificaciones
    await this.initializeNotifications();
    
    console.log('✅ DrinkMate inicializado correctamente');
  }
}