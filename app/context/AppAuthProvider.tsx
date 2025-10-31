import React from 'react';
import { AuthProvider } from './AuthContext';
import { EmpresaAuthProvider } from './EmpresaAuthContext';

/**
 * Provider principal que combina autenticación de usuarios y empresas
 */
interface Props {
  children: React.ReactNode;
}

export const AppAuthProvider: React.FC<Props> = ({ children }) => {
  return (
    <AuthProvider>
      <EmpresaAuthProvider>
        {children}
      </EmpresaAuthProvider>
    </AuthProvider>
  );
};