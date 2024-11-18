import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../../lib/utils/api';
import { FaSignOutAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Button, Icon, Spinner, Text } from '@chakra-ui/react';

const ButtonDeconnexion = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    // Confirmation de déconnexion avec SweetAlert2
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      text: "Cette action vous déconnectera de votre session.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, déconnecter',
      confirmButtonColor: '#CE0033',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        setError('');
        try {
          // Appel de l'API pour la déconnexion
          await api('logout', 'POST');
          // Suppression du token
          localStorage.removeItem('token');
          // Redirection vers la page de connexion
          router.push('/connexion');
        } catch (error) {
          console.error('Erreur lors de la déconnexion', error);
          setError('Une erreur est survenue lors de la déconnexion. Veuillez réessayer.');
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  return (
    <>
      <Button
        onClick={handleLogout}
        isLoading={isLoading} // Chakra's loading state support
        colorScheme="gray"
        leftIcon={!isLoading && <Icon as={FaSignOutAlt} />}
        loadingText="Déconnexion..."
        size="md"
        isDisabled={isLoading}
      >
        {isLoading ? <Spinner size="sm" /> : ''}
      </Button>
      {error && (
        <Text mt={2} color="gray.500">
          {error}
        </Text>
      )}
    </>
  );
};

export default ButtonDeconnexion;
