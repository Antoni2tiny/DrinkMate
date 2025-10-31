import React, { useState } from 'react';
import RegistroEmpresa from './RegistroEmpresa';
import EmpresaLogin from './EmpresaLogin';

type FlowMode = 'register' | 'login';

interface Props {
  onSuccess: (empresa: any) => void;
  onCancel: () => void;
  initialMode?: FlowMode;
}

/**
 * Flujo completo de registro/login para empresas
 */
export default function EmpresaRegistroFlow({ 
  onSuccess, 
  onCancel, 
  initialMode = 'register' 
}: Props) {
  const [mode, setMode] = useState<FlowMode>(initialMode);

  if (mode === 'login') {
    return (
      <EmpresaLogin
        onLoginSuccess={(user, empresa) => {
          console.log('✅ Empresa logueada:', empresa.nombre);
          onSuccess(empresa);
        }}
        onNavigateToRegister={() => setMode('register')}
        onCancel={onCancel}
      />
    );
  }

  return (
    <RegistroEmpresa
      onEmpresaCreated={(empresa) => {
        console.log('✅ Empresa registrada:', empresa.nombre);
        if (empresa.conCuenta) {
          // Si se registró con cuenta, ir al login
          setMode('login');
        } else {
          // Si es registro simple, volver
          onSuccess(empresa);
        }
      }}
      onCancel={onCancel}
      withAuth={true} // Incluir campos de autenticación
    />
  );
}