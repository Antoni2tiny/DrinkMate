import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import FavoritesScreen from './favorites/Favorites';

/**
 * Favoritos protegidos que requieren autenticación
 */
export default function ProtectedFavorites() {
  return (
    <ProtectedRoute
      requireAuth={true}
      title="Mis Favoritos"
      description="Guarda y sincroniza tus bares y tragos favoritos. Esta función está disponible solo para usuarios registrados."
    >
      <FavoritesScreen />
    </ProtectedRoute>
  );
}