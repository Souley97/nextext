import React, { useMemo } from 'react';
import { FaUserAlt, FaQrcode, FaHistory, FaUser } from 'react-icons/fa';
import { useUserWithRoles } from '../../../lib/utils/hooks/useUserWithRoles';
import { getUserWithRoles } from '../../../lib/utils/checkRole';
import ThemeToggleButton from '../DarkMode';
import ButtonDeconnexion from '../../common/ButtonDeconnexion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Box, Center, Text, Flex, useBreakpointValue, Spinner, Popover, PopoverTrigger, PopoverContent,
  PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Button,
} from '@chakra-ui/react';
import { IoSettingsOutline } from 'react-icons/io5';

const ProfileCardApprenant = React.memo(() => {
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const iconSize = useBreakpointValue({ base: '20px', md: '30px' });
  const isMobile = useBreakpointValue({ base: true, md: false }); // Nouveau point de rupture
  const { roles, user, loading } = useUserWithRoles(['Apprenant']);

  const fullName = useMemo(() => (user ? `${user.prenom} ${user.nom}` : ''), [user]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="lg" color="red.500" />
      </Center>
    );
  }

  if (!user) {
    return <p>Une erreur est survenue. Veuillez vous reconnecter.</p>;
  }

  // Ajouter "(e)" au rôle si l'utilisateur est une femme
  const formattedRoles = roles.map((role) =>
    user.sexe === 'femme' ? `${role}e` : role
  );

  return (
    <Box
      bg="#CE0033"
      roundedBottomEnd="3xl"
      roundedBottomStart="3xl"
      width="100%"
      px={{ base: '1%', md: '1%', lg: '5%' }}
      shadow="lg"
      textAlign="center"
      pt={8}
    >
      {/* Contenu du profil */}
      <Center display="flex" mt={4} textAlign="center">
        <Box color="white" px={{ base: '8px', md: '10px', lg: '140px' }}>
          <Text fontSize={{ base: '20px', md: '20px', lg: '35px' }} fontWeight="bold">
            {fullName}
          </Text>
          {formattedRoles.length > 0 && <Text>{formattedRoles.join(', ')}</Text>}
        </Box>
      </Center>
    </Box>
  );
});

export default ProfileCardApprenant;
