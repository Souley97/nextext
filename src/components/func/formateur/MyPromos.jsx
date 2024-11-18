import { Box, Text, SimpleGrid } from '@chakra-ui/react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import PromoCard from '../../common/PromoCard';
import PromoHeader from '../../common/PromoHeader';
import CardBox from '../../common/Card';

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

const MyPromos = () => {
  // Récupérer les promos en cours et terminées
  const { data: promosData, error: promosError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/promos/encours`,
    fetcher
  );
  const { data: promosDataTerminer, error: promosErrorTerminer } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/promos/terminer`,
    fetcher
  );
  const router = useRouter();

  // Rediriger vers la page de la promotion sélectionnée
  const handlePromoClick = (promoId) => {
    router.push(`/formateur/promos/${promoId}`);
  };

  // Récupérer les pointages du jour pour une promotion
  

  if (promosError && promosErrorTerminer) {
    return (

        <SimpleGrid
          mx={{ base: '2px', md: '3px', lg: '12px' }}
          justifyContent="space-between"
          columns={[1, 2]}
          spacing={8}
        >
         
          <CardBox as="section">
            {' '}
            <PromoHeader />
            <Text color="red.500">Aucune promotion</Text>{' '}
          </CardBox>
        </SimpleGrid>
    );
  }

  const promos = promosData ? promosData.promos : [];
  const promosTerminer = promosDataTerminer ? promosDataTerminer.promos : [];

  return (
  
        <Box as="section" flex="2">
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
        </Box>
  );
};

export default MyPromos;
