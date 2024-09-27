import React, { useMemo } from 'react';
import { Box, Center, Text, Flex, useBreakpointValue, Spinner } from '@chakra-ui/react';
import { FaUserAlt, FaQrcode, FaHistory } from 'react-icons/fa';
import { useUserWithRoles } from '../../../lib/utils/hooks/useUserWithRoles';
import { getUserWithRoles } from '../../../lib/utils/checkRole';
import ThemeToggleButton from '../DarkMode';
import ButtonDeconnexion from '../../common/ButtonDeconnexion';
import Link from 'next/link';

// eslint-disable-next-line react/display-name
const ProfileCardApprenant = React.memo(() => {
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const iconSize = useBreakpointValue({ base: '20px', md: '30px' });
  const { roles,user, loading } = useUserWithRoles(['Apprenant']);

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

  return (
    <Box
      bg="#CE0033"
      roundedBottomEnd="3xl"
      roundedBottomStart="3xl"
      width="100%"
      px={{ base: '5%', md: '5%', lg: '25%' }}
      shadow="lg"
      textAlign="center"
    >
      <ThemeToggleButton />

      <Flex
        justify="space-between"
        align="center"
        bg="black"
        width="100%"
        rounded="xl"
        py={2}
        px={{ base: '10%', md: '40px', lg: '80px' }}
        color="white"
        shadow="lg"
        border="2px solid #CE0033"
      >
        <Link href='/apprenant/profile' passHref>
          <Flex color="white" display="flex" flexDirection="column" alignItems="center" fontSize={buttonSize}>
            <FaUserAlt size={iconSize} />
            <Text mt={2}>Profile</Text>
          </Flex>
        </Link>
        
        <Link href='/apprenant' passHref>
          <Flex color="white" display="flex" flexDirection="column" alignItems="center">
            <FaQrcode size={iconSize} />
            <Text mt={2}>QR Code</Text>
          </Flex>
        </Link>

        <Link href='/apprenant/mesPointages' passHref>
          <Flex color="white" display="flex" flexDirection="column" alignItems="center" fontSize={buttonSize}>
            <FaHistory size={iconSize} />
            <Text mt={2}>Historique</Text>
          </Flex>
        </Link>
      </Flex>

      <Center display='flex' mt={4} textAlign="center">
        <Box color="white" px={20}>
          <Text fontSize={{ base: '20px', md: '20px', lg: '35px' }} fontWeight="bold">{fullName}</Text>
          {roles.length > 0 &&

<Text>       {roles.join(', ')}
</Text>
}        </Box>
        <Box mt={4}>
          <ButtonDeconnexion />
        </Box>
      </Center>

      <Center mt={4}>
        <Box w="14" h="1" bg="#CE0033" rounded="full" />
      </Center>
    </Box>
  );
});

export async function getServerSideProps(context) {
  const result = await getUserWithRoles(context, ['Apprenant']);
  console.log('Server-side props:', result);
  return result;
}

export default ProfileCardApprenant;
