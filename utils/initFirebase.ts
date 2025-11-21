import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

let app: FirebaseApp | null = null;

export const firebaseApp = (() => {
  if (app) return app;
  
  // Configuración real de Firebase
  const config = {
    apiKey: "AIzaSyAj53VYhfVgKF2bJUwPGbriYkJAHD71kj0",
    authDomain: "drinkmate-app-a8f61.firebaseapp.com",
    projectId: "drinkmate-app-a8f61",
    storageBucket: "drinkmate-app-a8f61.firebasestorage.app",
    messagingSenderId: "400426502503",
    appId: "1:400426502503:web:f3eb4dc8fcc00d5bd507c2",
    measurementId: "G-DNNV7562M4"
  };
  
  // Verificar que la configuración no esté vacía
  if (config.apiKey === 'YOUR_API_KEY') {
    console.warn('⚠️ Firebase no configurado. Usando modo offline.');
    return null;
  }
  
  try {
    app = initializeApp(config);
    
    // Inicializar Auth con AsyncStorage para persistencia
    initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    
    return app;
  } catch (error) {
    console.error('❌ Error inicializando Firebase:', error);
    return null;
  }
})();


