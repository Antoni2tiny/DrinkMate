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
import { FirestoreEmpresaService } from './firebaseServices';

// Inicializar Auth con persistencia (compartido con usuarios)
let auth: any = null;

if (firebaseApp) {
  try {
    // Usar el mismo auth que los usuarios (Firebase Auth es compartido)
    auth = getAuth(firebaseApp);
  } catch (error) {
    // Si no existe, inicializar con persistencia
    auth = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
}

/**
 * Servicio de autenticación específico para empresas
 */
export class FirebaseEmpresaAuthService {
  
  /**
   * Registrar nueva empresa con cuenta
   */
  static async registerEmpresa(
    email: string, 
    password: string, 
    empresaData: {
      nombre: string;
      tipo: string;
      descripcion: string;
      direccion: string;
      telefono?: string;
      logo?: string;
    }
  ): Promise<{
    success: boolean;
    user?: User;
    empresaId?: string;
    error?: string;
  }> {
    if (!auth) {
      return { success: false, error: 'Firebase no configurado' };
    }

    try {
      // 1. Crear cuenta de Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Actualizar perfil con nombre de empresa
      await updateProfile(userCredential.user, {
        displayName: empresaData.nombre
      });
      
      // 3. Crear perfil de empresa en Firestore
      const empresaId = await FirestoreEmpresaService.createEmpresaWithAuth(
        userCredential.user.uid,
        {
          ...empresaData,
          email,
          ownerId: userCredential.user.uid,
        }
      );
      
      if (empresaId) {
        return { 
          success: true, 
          user: userCredential.user,
          empresaId 
        };
      } else {
        // Si falla la creación en Firestore, eliminar usuario de Auth
        await userCredential.user.delete();
        return { success: false, error: 'Error creando perfil de empresa' };
      }
      
    } catch (error: any) {
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  /**
   * Iniciar sesión como empresa
   */
  static async loginEmpresa(email: string, password: string): Promise<{
    success: boolean;
    user?: User;
    empresa?: any;
    error?: string;
  }> {
    if (!auth) {
      return { success: false, error: 'Firebase no configurado' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Verificar que el usuario tiene una empresa asociada
      const empresa = await FirestoreEmpresaService.getEmpresaByOwnerId(userCredential.user.uid);
      
      if (empresa) {
        return { 
          success: true, 
          user: userCredential.user,
          empresa 
        };
      } else {
        // Es un usuario normal, no una empresa
        await signOut(auth);
        return { 
          success: false, 
          error: 'Esta cuenta no está asociada a ninguna empresa' 
        };
      }
      
    } catch (error: any) {
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  /**
   * Cerrar sesión
   */
  static async logoutEmpresa(): Promise<boolean> {
    if (!auth) return false;

    try {
      await signOut(auth);
      return true;
    } catch (error) {
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
   * Escuchar cambios de autenticación para empresas
   */
  static onEmpresaAuthStateChange(callback: (user: User | null, empresa: any | null) => void): (() => void) | null {
    if (!auth) return null;

    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Verificar si el usuario tiene empresa asociada
        const empresa = await FirestoreEmpresaService.getEmpresaByOwnerId(user.uid);
        callback(user, empresa);
      } else {
        callback(null, null);
      }
    });
  }

  /**
   * Convertir códigos de error a mensajes legibles
   */
  private static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Empresa no encontrada';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta con este email';
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