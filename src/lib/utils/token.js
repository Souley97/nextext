// lib/utils/token.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Hook personnalisé pour vérifier le token et rediriger si besoin
export const useAuthToken = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Si le token n'est pas trouvé, rediriger vers la page de login
    if (!token) {
      router.push('/connexion');
    }
  }, [router]); // Ajoute router comme dépendance pour éviter les erreurs
};
