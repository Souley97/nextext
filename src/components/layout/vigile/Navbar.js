import {
  Box,
  Center,
  Link,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FaHistory, FaQrcode, FaUserAlt } from 'react-icons/fa'; // Import des icônes
import Swal from 'sweetalert2'; // Import de SweetAlert

import { getUserWithRoles } from '../../../lib/utils/checkRole';
import { useUserWithRoles } from '../../../lib/utils/hooks/useUserWithRoles';

const NavbarVigile = () => {
  const router = useRouter();
  const activeColor = '#CE0033'; // Couleur pour l'état actif
  const inactiveColor = useColorModeValue('gray.600', 'gray.400'); // Couleur pour l'état inactif selon le mode
  useUserWithRoles(['Vigile']);
  const { user, loading } = useUserWithRoles(['Vigile']);

  const fullName = useMemo(
    () => (user ? `${user.prenom} ${user.nom}` : ''),
    [user]
  );

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="lg" color="red.500" />
      </Center>
    );
  }

  if (!user) {
    return (
      <Center h="100vh">
        <Text>Une erreur est survenue. Veuillez vous reconnecter.</Text>
      </Center>
    );
  }

  // Fonction pour afficher SweetAlert et rediriger selon le choix
  const handleOptionClick = () => {
    Swal.fire({
      title: 'Naviguer vers:',
      text: 'Choisissez heure de pointage',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#CE0033',
      cancelButtonColor: '#CE0033',

      confirmButtonText: 'Arrivée',
      cancelButtonText: 'Départ',
    }).then((result) => {
      if (result.isConfirmed) {
        // Rediriger vers la page d'arrivée
        router.push('/vigile/pointages/arrivee');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Rediriger vers la page de départ
        router.push('/vigile/pointages/depart');
      }
    });
  };

  return (
    <Box
      position="fixed"
      bottom="0"
      borderRadius="xl"
      px={{ base: '4%', lg: '5%' }}
      w={{ base: '96%', lg: '50%' }}
      mx="auto"
      left="50%"
      shadow="2xl"
      transform="translateX(-50%)"
    >
      <Text fontSize={{ base: '20px', lg: '35px' }} fontWeight="bold">
        {fullName}
      </Text>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        borderRadius="md"
        borderBottom="2px solid"
        fontFamily="Nunito Sans"
        borderColor="#CE0033"
        color="white"
        shadow="lg"
        px={{ base: '10%', md: '40px', lg: '80px' }}
        py={3}
        position="fixed"
        bottom="0"
        left="0"
        right="0"
      >
        {/* Lien vers l'option (avec SweetAlert) */}
        <Box
          as="button"
          size="sm"
          variant="ghost"
          _focus={{ outline: 'none' }}
          color={router.pathname === '/option' ? activeColor : inactiveColor}
          onClick={handleOptionClick} // Appelle la fonction quand l'utilisateur clique
        >
          {' '}
          <Box mt={4}></Box>
          <Center flexDirection="column">
            <FaUserAlt size={30} />
            <Text mt={2}>Option</Text>
          </Center>
        </Box>

        {/* Lien vers le scanner */}
        <Box position="relative">
          <Link
            href="/vigile/scanner"
            size="sm"
            variant="ghost"
            _focus={{ outline: 'none' }}
          >
            <Center
              bg={
                router.pathname === '/vigile/scanner'
                  ? activeColor
                  : 'transparent'
              }
              p="3"
              borderRadius="full"
              shadow="md"
              flexDirection="column"
            >
              <FaQrcode
                size={30}
                color={
                  router.pathname === '/vigile/scanner' ? 'white' : 'black'
                }
              />
              <Text
                color={
                  router.pathname === '/vigile/scanner' ? 'white' : 'black'
                }
                mt={2}
              >
                Scanner
              </Text>
            </Center>
          </Link>
        </Box>

        {/* Lien vers l'historique */}
        <Link
          href="/vigile/pointages"
          size="sm"
          variant="ghost"
          _focus={{ outline: 'none' }}
          color={
            router.pathname === '/vigile/pointages'
              ? activeColor
              : inactiveColor
          }
        >
          <Center flexDirection="column">
            <FaHistory size={30} />
            <Text mt={2}>Historique</Text>
          </Center>
        </Link>
      </Box>
    </Box>
  );
};

export async function getServerSideProps(context) {
  const result = await getUserWithRoles(context, ['Administrateur']);
  console.log('Server-side props:', result);
  return result;
}
export default NavbarVigile;
