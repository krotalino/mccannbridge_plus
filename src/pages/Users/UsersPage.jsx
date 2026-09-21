import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BridgeIAM from './BridgeIAM';

export default function UsersPage() {
  const { isAgency, isClient, user } = useAuth();

  // Confidentialité : Les comptes avec la vue/rôle Client ne peuvent pas accéder à Utilisateurs & Droits
  if (isClient || user?.role === 'client' || !isAgency) {
    return <Navigate to="/briefs" replace />;
  }

  return <BridgeIAM />;
}
