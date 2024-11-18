/* eslint-disable no-unused-vars */
import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import CardBox from '../../../components/common/Card';
import PromoAssign from '../../../components/common/PromoAssign';
import PromoCard from '../../../components/common/PromoCard';
import PointageHebdomadaire from '../../../components/func/admin/PointageHebdomadaire';
import ProfileCardAdministrateur from '../../../components/layout/admin/Navbar';
import PromoHeader from '../../../components/layout/admin/PromoHeader';

// Fonction de récupération des données
const fetcher = (url) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Erreur lors de la récupération des données.');
    return res.json();
  });

const Dashboard = () => {
  // Récupérer les promos en cours et terminées
  const { data: promosData, error: promosError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/promos/encours`,
    fetcher
  );
  const { data: promosDataTerminer, error: promosErrorTerminer } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/promos/terminees`,
    fetcher
  );

  const router = useRouter();

  // Rediriger vers la page de la promotion sélectionnée
  const handlePromoClick = (promoId) => {
    router.push(`/admins/promos/${promoId}`);
  };

  // Fetch assistants
  const { data: assistantsData, error: assistantsError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/formateurs`,

    fetcher
  );
  const assistants = assistantsData ? assistantsData : [];
  console.log(assistants);

  const assignAssistant = async (promoId, assistantId) => {
    try {
      const response = await fetimport React, { useMemo } from 'react';
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
      ch(
        `${process.env.NEXT_PUBLIC_API_URL}/promos/${promoId}/assign-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ assistant_id: assistantId }),
        }
      );

      if (!response.ok)
        throw new Error("Erreur lors de l'assignation de l'assistant.");

      const data = await response.json();
      if (data.success) {
        alert('Assistant assigné avec succès.');
        // Optionally, refetch promos data here if needed
      }
    } catch (error) {
      console.error("Erreur lors de l'assignation de l'assistant:", error);
    }
  };

  // Récupérer les pointages du jour pour une promotion
  const fetchPointages = async (promoId) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/promos/${promoId}/pointages-aujourdhui`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setPointages(data.pointages);
        setSelectedPromoId(promoId);
      } else {
        console.error(
          data.message || 'Erreur lors de la récupération des pointages.'
        );
      }
    } else {
      console.error('Erreur lors de la récupération des pointages.');
    }
  };

  if (promosError || promosErrorTerminer) {
    return (
      <Box p={0}>
        {/* Profil Formateur et Header */}
        <ProfileCardAdministrateur />

        <SimpleGrid
          mx={{ base: '2px', md: '3px', lg: '12px' }}
          justifyContent="space-between"
          columns={[1, 2]}
          spacing={8}
        >
          <Box
            as="section"
            px={{ base: '2px', md: '3px', lg: '20px' }}
            mx={{ base: '2px', md: '3px', lg: '10px' }}
            py={8}
            mt={7}
            w="full"
            maxW={{ base: '366px', md: '100%', lg: '100%' }}
            borderBottom="2px solid"
            borderTop="2px solid"
            borderColor="#CE0033"
            borderRadius="md"
            shadow="lg"
            bg="whiteAlpha.80"
            fontFamily="Nunito Sans"
            flex="2"
            display={{ base: 'none', md: 'none', lg: 'block' }}
          ></Box>
          <Box
            as="section"
            px={{ base: '2px', md: '3px', lg: '20px' }}
            mx={{ base: '2px', md: '3px', lg: '10px' }}
            py={8}
            mt={7}
            w="full"
            maxW={{ base: '366px', md: '100%', lg: '100%' }}
            borderBottom="2px solid"
            borderTop="2px solid"
            borderColor="#CE0033"
            borderRadius="md"
            shadow="lg"
            bg="whiteAlpha.80"
            fontFamily="Nunito Sans"
            flex="2"
          >
            {' '}
            <PromoHeader />
            <Text color="red.500">Aucune promotion</Text>{' '}
          </Box>
        </SimpleGrid>
      </Box>
    );
  }

  const promos = promosData ? promosData : [];
  const promosTerminer = promosDataTerminer ? promosDataTerminer : [];

  return (
    <Box p={0}>
      {/* Profil Formateur et Header */}
      <ProfileCardAdministrateur />

      <SimpleGrid
        mx={{ base: '2px', md: '3px', lg: '12px' }}
        justifyContent="space-between"
        columns={[1, 2]}
        spacing={8}
      >
        <CardBox
          as="section"
          maxW={{ base: '366px', md: '100%', lg: '90%' }}
          display={{ base: 'block', md: 'block', lg: 'block' }}
        >
          {/* <ListePointage /> */}
          <PointageHebdomadaire
          // pointages={pointages}
          // promoId={selectedPromoId}
          // fetchPointages={fetchPointages}
          />
          ;
        </CardBox>
        <CardBox
          as="section"
          px={{ base: '2px', md: '3px', lg: '20px' }}
          mx={{ base: '2px', md: '3px', lg: '10px' }}
          py={8}
          mt={7}
          w="full"
          maxW={{ base: '366px', md: '100%', lg: '60%' }}
        >
          {/* <PromoAssign
            promos={promos}
            assignAssistant={assignAssistant}
            assistants={assistants} 
          />*/}
          {/* {' '} */}
          <PromoHeader />
          {promos.length > 0 ? (
            <PromoCard
              promos={promos}
              handlePromoClick={handlePromoClick}
              assignAssistant={assignAssistant}
              assistants={assistants}
            />
          ) : (
            <Text fontSize="lg" color="red.500">
              Aucune promotion en cours.
            </Text>
          )}{' '}
          {/* Liste des Promos terminées */}
          {promosTerminer.length > 0 ? (
            <PromoCard
              promos={promosTerminer}
              isCompleted
              handlePromoClick={handlePromoClick}
            />
          ) : (
            <Text fontSize="lg" color="red.500">
              Aucune promotion terminée.
            </Text>
          )}{' '}
        </CardBox>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
