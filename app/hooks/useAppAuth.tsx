import { useAuth } from '../context/AuthContext';
import { useEmpresaAuth } from '../context/EmpresaAuthContext';

export type UserType = 'guest' | 'user' | 'empresa';

/**
 * Hook unificado para manejar autenticación de usuarios y empresas
 */
export const useAppAuth = () => {
  const userAuth = useAuth();
  const empresaAuth = useEmpresaAuth();

  // Determinar el tipo de usuario actual
  const getUserType = (): UserType => {
    if (empresaAuth.isAuthenticated) return 'empresa';
    if (userAuth.isAuthenticated) return 'user';
    return 'guest';
  };

  // Obtener datos del usuario actual (sea usuario o empresa)
  const getCurrentUserData = () => {
    const userType = getUserType();
    
    switch (userType) {
      case 'user':
        return {
          type: 'user' as const,
          user: userAuth.user,
          profile: userAuth.userProfile,
          displayName: userAuth.userProfile?.nombre || userAuth.user?.displayName || 'Usuario',
          email: userAuth.user?.email,
        };
      case 'empresa':
        return {
          type: 'empresa' as const,
          user: empresaAuth.user,
          profile: empresaAuth.empresa,
          displayName: empresaAuth.empresa?.nombre || 'Empresa',
          email: empresaAuth.user?.email,
        };
      default:
        return {
          type: 'guest' as const,
          user: null,
          profile: null,
          displayName: 'Invitado',
          email: null,
        };
    }
  };

  // Función de logout universal
  const logoutAll = async () => {
    try {
      if (empresaAuth.isAuthenticated) {
        await empresaAuth.logoutEmpresa();
      }
      if (userAuth.isAuthenticated) {
        await userAuth.logout();
      }
    } catch (error) {
      console.error('Error en logout universal:', error);
    }
  };

  // Estado de carga combinado
  const isLoading = userAuth.isLoading || empresaAuth.isLoading;

  // Verificar si hay algún usuario autenticado
  const isAuthenticated = userAuth.isAuthenticated || empresaAuth.isAuthenticated;

  return {
    // Estados
    userType: getUserType(),
    isAuthenticated,
    isLoading,
    currentUser: getCurrentUserData(),
    
    // Contextos específicos
    userAuth,
    empresaAuth,
    
    // Funciones
    logoutAll,
    
    // Helpers
    isUser: getUserType() === 'user',
    isEmpresa: getUserType() === 'empresa',
    isGuest: getUserType() === 'guest',
  };
};