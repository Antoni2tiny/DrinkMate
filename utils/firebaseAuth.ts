import { 
  initializeAuth,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  getReactNativePersistence
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseApp } from './initFirebase';

// Inicializar Auth con persistencia
let auth: any = null;

if (firebaseApp) {
  try {
    // Intentar obtener auth existente
    auth = getAuth(firebaseApp);
  } catch (error) {
    // Si no existe, inicializar con persistencia
    auth = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
}

/**
 * Servicio de autenticación con Firebase
 */
export class FirebaseAuthService {
  
  /**
   * Registrar nuevo usuario
   */
  static async register(email: string, password: string, displayName: string): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    if (!auth) {
      return { success: false, error: 'Firebase no configurado' };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar el perfil con el nombre
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('❌ Error registrando usuario:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  /**
   * Iniciar sesión
   */
  static async login(email: string, password: string): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    if (!auth) {
      return { success: false, error: 'Firebase no configurado' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('❌ Error iniciando sesión:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  /**
   * Cerrar sesión
   */
  static async logout(): Promise<boolean> {
    if (!auth) return false;

    try {
      await signOut(auth);
      console.log('✅ Sesión cerrada');
      return true;
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
      return false;
    }
  }

  /**
   * Obtener usuario actual
   */
  static getCurrentUser(): User | null {
    return auth?.currentUser || null;
  }

  /**
   * Escuchar cambios de autenticación
   */
  static onAuthStateChange(callback: (user: User | null) => void): (() => void) | null {
    if (!auth) return null;

    return onAuthStateChanged(auth, callback);
  }

  /**
   * Convertir códigos de error a mensajes legibles
   */
  private static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/email-already-in-use':
        return 'El email ya está en uso';
      case 'auth/weak-password':
        return 'La contraseña es muy débil';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde';
      default:
        return 'Error de autenticación';
    }
  }
}