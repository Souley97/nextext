import { useRouter } from 'next/router';
import useSWR from 'swr';
import { api } from '../api';

const fetcher = async (url) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token');

  const response = await api(url, 'GET', null, token);
  return response.user;
};

export const useUserWithRoles = (requiredRoles = []) => {
  const router = useRouter();
  const { data: user, error } = useSWR('user', fetcher);
  
  // Loading state
  const loading = !user && !error;

  // Extract roles from user data
  const roles = user ? user.roles.map(r => r.name) : [];

  // Check if the user has required roles
  const hasRequiredRole = requiredRoles.some(role => roles.includes(role));

  // Redirect to login if no token or to unauthorized page if no roles
  if (loading) return { user: null, roles: [], loading, error: null };
  if (error || !user) {
    router.push('/connexion');
    return { user: null, roles: [], loading: false, error: 'Erreur de chargement des données utilisateur.' };
  }
  // if (!hasRequiredRole) {
  //   router.push('/unauthorized');
  // }

  return { user, roles, loading, error: null };
};
