import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import UploadDrinkScreen from './UploadDrink';

/**
 * Subir tragos protegido que requiere autenticación
 */
export default function ProtectedUpload() {
  return (
    <ProtectedRoute
      requireAuth={true}
      title="Subir Tragos"
      description="Comparte tus creaciones con la comunidad. Esta función está disponible solo para usuarios registrados."
    >
      <UploadDrinkScreen />
    </ProtectedRoute>
  );
}