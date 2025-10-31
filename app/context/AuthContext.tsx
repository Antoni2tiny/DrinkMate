import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { FirebaseAuthService } from '../../utils/firebaseAuth';
import { FirestoreUserService } from '../../utils/firebaseServices';

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, nombre: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios de autenticación
    const unsubscribe = FirebaseAuthService.onAuthStateChange(async (firebaseUser) => {
      console.log('🔐 Estado de autenticación cambió:', firebaseUser?.email || 'No autenticado');
      
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Cargar perfil del usuario desde Firestore
        const profile = await FirestoreUserService.getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
        console.log('👤 Perfil de usuario cargado:', profile?.nombre || 'Sin perfil');
      } else {
        setUserProfile(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe || (() => {});
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await FirebaseAuthService.login(email, password);
      
      if (result.success && result.user) {
        // El listener de onAuthStateChange se encargará de actualizar el estado
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error inesperado' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, nombre: string) => {
    try {
      setIsLoading(true);
      const result = await FirebaseAuthService.register(email, password, nombre);
      
      if (result.success && result.user) {
        // Crear perfil en Firestore
        await FirestoreUserService.createUserProfile(result.user.uid, {
          nombre,
          email,
          fechaRegistro: new Date().toISOString(),
          activo: true,
        });
        
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: 'Error inesperado' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await FirebaseAuthService.logout();
      // El listener se encargará de limpiar el estado
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) return false;
    
    try {
      const success = await FirestoreUserService.updateUserProfile(user.uid, updates);
      
      if (success) {
        // Recargar perfil
        const updatedProfile = await FirestoreUserService.getUserProfile(user.uid);
        setUserProfile(updatedProfile);
      }
      
      return success;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};