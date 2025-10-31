import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import TriviaScreen from './Trivia';

/**
 * Trivia protegida que requiere autenticación
 */
export default function ProtectedTrivia() {
  return (
    <ProtectedRoute
      requireAuth={true}
      title="Trivia Exclusiva"
      description="La trivia está disponible solo para usuarios registrados. ¡Regístrate gratis y demuestra tus conocimientos sobre cócteles!"
    >
      <TriviaScreen />
    </ProtectedRoute>
  );
}