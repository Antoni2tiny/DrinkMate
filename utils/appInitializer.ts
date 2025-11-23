import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native'; // Importar Platform
import Constants from 'expo-constants'; // Importar Constants

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
      // Configurar el manejador de notificaciones lo antes posible para todas las notificaciones
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      // ***** Lógica para evitar el error de notificaciones push en Expo Go (Android SDK 53+) *****
      if (Constants.appOwnership === 'expo' && Platform.OS === 'android') {
        console.log('📱');
        // Retornar inmediatamente para evitar cualquier llamada a funciones de push.
        return;
      }
      // ***** Fin de la lógica específica para Expo Go (Android SDK 53+) *****

      // Si llegamos aquí, procedemos con la configuración de notificaciones locales.

      // La verificación de projectId ya no es necesaria si no registramos push tokens.
      // const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.expoConfig?.projectId;

      // if (!projectId) {
      //   console.log('⚠️ [ADVERTENCIA] No se encontró projectId en app.json. Las notificaciones push no serán registradas.');
      //   return;
      // }

      // Solicitar permisos de notificación (para locales)
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

      console.log('✅ Notificaciones configuradas correctamente (push y/o locales)');
    } catch (error) {
      // Capturamos cualquier error inesperado, pero SOLO lo logeamos en la consola
      // sin mostrar ninguna alerta al usuario.
      console.warn('❌ Error silencioso al configurar notificaciones:', error);
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
    console.log('Constants.appOwnership:', Constants.appOwnership);
    console.log('Platform.OS:', Platform.OS);
    
    // Verificar Firebase
    this.checkFirebaseStatus();
    
    // Configurar notificaciones
    await this.initializeNotifications();
    
    console.log('✅ DrinkMate inicializado correctamente');
  }
}