import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { firebaseApp } from './initFirebase';
import { Cupon } from './models';

// Inicializar Firestore
const db = firebaseApp ? getFirestore(firebaseApp) : null;

/**
 * Servicio para manejar cupones en Firestore
 */
export class FirestoreCuponService {
  
  /**
   * Crear un nuevo cupón
   */
  static async createCupon(cupon: Omit<Cupon, 'id'>): Promise<string | null> {
    if (!db) {
      console.log('Firebase no configurado, usando almacenamiento local');
      return null;
    }

    try {
      // Limpiar valores undefined antes de enviar a Firebase
      const cleanCupon = Object.fromEntries(
        Object.entries(cupon).filter(([_, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, 'cupones'), {
        ...cleanCupon,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      console.log('✅ Cupón creado en Firestore:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creando cupón:', error);
      return null;
    }
  }

  /**
   * Obtener cupones de una empresa
   */
  static async getCuponesByEmpresa(empresaId: string): Promise<Cupon[]> {
    if (!db) return [];

    try {
      // Primero intentar sin orderBy para evitar problemas de índice
      const q = query(
        collection(db, 'cupones'),
        where('empresaId', '==', empresaId)
      );
      
      const querySnapshot = await getDocs(q);
      const cupones: Cupon[] = [];
      
      querySnapshot.forEach((doc) => {
        cupones.push({
          id: doc.id,
          ...doc.data()
        } as Cupon);
      });
      
      // Ordenar manualmente por fecha de creación
      cupones.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.fechaInicio || '').getTime();
        const dateB = new Date(b.createdAt || b.fechaInicio || '').getTime();
        return dateB - dateA; // Más recientes primero
      });
      
      return cupones;
    } catch (error) {
      console.error('❌ Error obteniendo cupones:', error);
      return [];
    }
  }

  /**
   * Actualizar un cupón
   */
  static async updateCupon(cuponId: string, updates: Partial<Cupon>): Promise<boolean> {
    if (!db) return false;

    try {
      // Limpiar valores undefined antes de actualizar
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      const cuponRef = doc(db, 'cupones', cuponId);
      await updateDoc(cuponRef, {
        ...cleanUpdates,
        updatedAt: new Date().toISOString(),
      });
      
      console.log('✅ Cupón actualizado:', cuponId);
      return true;
    } catch (error) {
      console.error('❌ Error actualizando cupón:', error);
      return false;
    }
  }

  /**
   * Eliminar un cupón
   */
  static async deleteCupon(cuponId: string): Promise<boolean> {
    if (!db) return false;

    try {
      await deleteDoc(doc(db, 'cupones', cuponId));
      console.log('✅ Cupón eliminado:', cuponId);
      return true;
    } catch (error) {
      console.error('❌ Error eliminando cupón:', error);
      return false;
    }
  }

  /**
   * Escuchar cambios en tiempo real
   */
  static subscribeToEmpresaCupones(
    empresaId: string, 
    callback: (cupones: Cupon[]) => void
  ): (() => void) | null {
    if (!db) return null;

    try {
      const q = query(
        collection(db, 'cupones'),
        where('empresaId', '==', empresaId),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const cupones: Cupon[] = [];
        querySnapshot.forEach((doc) => {
          cupones.push({
            id: doc.id,
            ...doc.data()
          } as Cupon);
        });
        callback(cupones);
      });

      return unsubscribe;
    } catch (error) {
      console.error('❌ Error suscribiéndose a cupones:', error);
      return null;
    }
  }
}

/**
 * Servicio para manejar usuarios en Firestore
 */
export class FirestoreUserService {
  
  /**
   * Crear perfil de usuario
   */
  static async createUserProfile(userId: string, userData: {
    nombre: string;
    email: string;
    fechaRegistro: string;
    activo: boolean;
    avatar?: string;
    telefono?: string;
    fechaNacimiento?: string;
    preferencias?: any;
  }): Promise<boolean> {
    if (!db) return false;

    try {
      await addDoc(collection(db, 'usuarios'), {
        userId,
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      console.log('✅ Perfil de usuario creado:', userData.email);
      return true;
    } catch (error) {
      console.error('❌ Error creando perfil de usuario:', error);
      return false;
    }
  }

  /**
   * Obtener perfil de usuario por ID
   */
  static async getUserProfile(userId: string): Promise<any | null> {
    if (!db) return null;

    try {
      const q = query(
        collection(db, 'usuarios'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error obteniendo perfil de usuario:', error);
      return null;
    }
  }

  /**
   * Actualizar perfil de usuario
   */
  static async updateUserProfile(userId: string, updates: any): Promise<boolean> {
    if (!db) return false;

    try {
      const q = query(
        collection(db, 'usuarios'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
        
        console.log('✅ Perfil de usuario actualizado:', userId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Error actualizando perfil de usuario:', error);
      return false;
    }
  }
}

/**
 * Servicio para manejar empresas en Firestore
 */
export class FirestoreEmpresaService {
  
  /**
   * Crear una nueva empresa (sin autenticación)
   */
  static async createEmpresa(empresa: {
    nombre: string;
    descripcion: string;
    direccion: string;
    telefono?: string;
    email?: string;
    logo?: string;
    tipo?: string;
  }): Promise<string | null> {
    if (!db) return null;

    try {
      const docRef = await addDoc(collection(db, 'empresas'), {
        ...empresa,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        activa: true,
      });
      
      console.log('✅ Empresa creada en Firestore:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creando empresa:', error);
      return null;
    }
  }

  /**
   * Crear empresa con autenticación (para registro con cuenta)
   */
  static async createEmpresaWithAuth(ownerId: string, empresa: {
    nombre: string;
    tipo: string;
    descripcion: string;
    direccion: string;
    telefono?: string;
    email: string;
    logo?: string;
    ownerId: string;
  }): Promise<string | null> {
    if (!db) return null;

    try {
      const docRef = await addDoc(collection(db, 'empresas'), {
        ...empresa,
        ownerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        activa: true,
        verificada: false, // Las empresas con cuenta necesitan verificación
        plan: 'basico', // Plan por defecto
      });
      
      console.log('✅ Empresa con autenticación creada:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creando empresa con auth:', error);
      return null;
    }
  }

  /**
   * Obtener empresa por ID del propietario (para autenticación)
   */
  static async getEmpresaByOwnerId(ownerId: string): Promise<any | null> {
    if (!db) return null;

    try {
      const q = query(
        collection(db, 'empresas'),
        where('ownerId', '==', ownerId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error obteniendo empresa por owner:', error);
      return null;
    }
  }

  /**
   * Actualizar datos de empresa
   */
  static async updateEmpresa(empresaId: string, updates: any): Promise<boolean> {
    if (!db) return false;

    try {
      const empresaRef = doc(db, 'empresas', empresaId);
      await updateDoc(empresaRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      
      console.log('✅ Empresa actualizada:', empresaId);
      return true;
    } catch (error) {
      console.error('❌ Error actualizando empresa:', error);
      return false;
    }
  }

  /**
   * Obtener todas las empresas activas
   */
  static async getEmpresasActivas(): Promise<any[]> {
    if (!db) return [];

    try {
      // Simplificar query para evitar problemas de índice
      const q = query(collection(db, 'empresas'));
      
      const querySnapshot = await getDocs(q);
      const empresas: any[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Filtrar activas manualmente
        if (data.activa !== false) { // Incluir si es true o undefined
          empresas.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      // Ordenar manualmente por nombre
      empresas.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
      
      return empresas;
    } catch (error) {
      console.error('❌ Error obteniendo empresas:', error);
      return [];
    }
  }
}