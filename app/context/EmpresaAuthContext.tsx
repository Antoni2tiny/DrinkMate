import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { FirebaseEmpresaAuthService } from '../../utils/firebaseEmpresaAuth';
import { FirestoreEmpresaService } from '../../utils/firebaseServices';

interface EmpresaAuthContextType {
  user: User | null;
  empresa: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginEmpresa: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerEmpresa: (email: string, password: string, empresaData: any) => Promise<{ success: boolean; error?: string }>;
  logoutEmpresa: () => Promise<void>;
  updateEmpresa: (updates: any) => Promise<boolean>;
}

const EmpresaAuthContext = createContext<EmpresaAuthContextType | undefined>(undefined);

export const useEmpresaAuth = () => {
  const context = useContext(EmpresaAuthContext);
  if (context === undefined) {
    throw new Error('useEmpresaAuth must be used within an EmpresaAuthProvider');
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

export const EmpresaAuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [empresa, setEmpresa] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios de autenticación para empresas
    const unsubscribe = FirebaseEmpresaAuthService.onEmpresaAuthStateChange(
      async (firebaseUser, empresaData) => {
        console.log('🏢 Estado de autenticación empresa cambió:', empresaData?.nombre || 'No autenticado');
        
        setUser(firebaseUser);
        setEmpresa(empresaData);
        setIsLoading(false);
      }
    );

    return unsubscribe || (() => {});
  }, []);

  const loginEmpresa = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await FirebaseEmpresaAuthService.loginEmpresa(email, password);
      
      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error en login empresa:', error);
      return { success: false, error: 'Error inesperado' };
    } finally {
      setIsLoading(false);
    }
  };

  const registerEmpresa = async (email: string, password: string, empresaData: any) => {
    try {
      setIsLoading(true);
      const result = await FirebaseEmpresaAuthService.registerEmpresa(
        email, 
        password, 
        empresaData
      );
      
      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error en registro empresa:', error);
      return { success: false, error: 'Error inesperado' };
    } finally {
      setIsLoading(false);
    }
  };

  const logoutEmpresa = async () => {
    try {
      setIsLoading(true);
      await FirebaseEmpresaAuthService.logoutEmpresa();
    } catch (error) {
      console.error('Error en logout empresa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmpresa = async (updates: any) => {
    if (!empresa) return false;
    
    try {
      const success = await FirestoreEmpresaService.updateEmpresa(empresa.id, updates);
      
      if (success) {
        // Recargar datos de empresa
        const updatedEmpresa = await FirestoreEmpresaService.getEmpresaByOwnerId(user!.uid);
        setEmpresa(updatedEmpresa);
      }
      
      return success;
    } catch (error) {
      console.error('Error actualizando empresa:', error);
      return false;
    }
  };

  const value: EmpresaAuthContextType = {
    user,
    empresa,
    isLoading,
    isAuthenticated: !!user && !!empresa,
    loginEmpresa,
    registerEmpresa,
    logoutEmpresa,
    updateEmpresa,
  };

  return (
    <EmpresaAuthContext.Provider value={value}>
      {children}
    </EmpresaAuthContext.Provider>
  );
};