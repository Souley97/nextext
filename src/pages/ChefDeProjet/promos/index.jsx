import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';
import CardBox from '../../../components/common/Card';
import PromoCard from '../../../components/common/PromoCard';
import ListePointage from '../../../components/func/apprenant/ListePointage';
import ProfileCardFormateur from '../../../components/layout/chefDeProjet/Navbar';
import PromoHeader from '../../../components/layout/chefDeProjet/PromoHeader';

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
    `${process.env.NEXT_PUBLIC_API_URL}/promos/encours`,
    fetcher
  );
  const { data: promosDataTerminer, error: promosErrorTerminer } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/promos/terminer`,
    fetcher
  );
  const [pointages, setPointages] = useState([]);
  const [selectedPromoId, setSelectedPromoId] = useState(null);
  const router = useRouter();

  // Rediriger vers la page de la promotion sélectionnée
  const handlePromoClick = (promoId) => {
    router.push(`/ChefDeProjet/promos/${promoId}`);
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
        <ProfileCardFormateur />

        <SimpleGrid
          mx={{ base: '2px', md: '3px', lg: '92px' }}
          justifyContent="space-between"
          columns={[1, 2]}
          spacing={48}
        >
          <Box
            as="section"
            px={{ base: '2px', md: '3px', lg: '120px' }}
            mx={{ base: '2px', md: '3px', lg: '110px' }}
            py={8}
            mt={7}
            w="full"
            maxW={{ base: '366px', md: '100%', lg: '70%' }}
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

  const promos = promosData ? promosData.promos : [];
  const promosTerminer = promosDataTerminer ? promosDataTerminer.promos : [];

  return (
    <Box p={0}>
      {/* Profil Formateur et Header */}
      <ProfileCardFormateur />

      <SimpleGrid
        mx={{ base: '2px', md: '3px', lg: '12px' }}
        justifyContent="space-between"
        columns={[1, 2]}
        spacing={8}
      >
        <CardBox
          as="section"
          px={{ base: '12px', md: '13px', lg: '40px' }}
          maxW={{ base: '366px', md: '100%', lg: '60%' }}
        >
          {/* <ListePointage /> */}
          {selectedPromoId && (
            <ListePointage
              pointages={pointages}
              promoId={selectedPromoId}
              fetchPointages={fetchPointages}
              isCompleted
            />
          )}
          ;
        </CardBox>
        <CardBox
          as="section"
          px={{ base: '12px', md: '13px', lg: '80px' }}
          maxW={{ base: '366px', md: '100%', lg: '60%' }}
        >
          {' '}
          <PromoHeader />
          {promos.length > 0 ? (
            <PromoCard promos={promos} handlePromoClick={handlePromoClick} />
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
