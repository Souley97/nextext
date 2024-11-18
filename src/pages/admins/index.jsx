/* eslint-disable no-unused-vars */
import {
  Box,
  Text,
  SimpleGrid,
  Button,
  Flex,
  Center,
  Spinner,
  Image,
} from '@chakra-ui/react';
import ProfileCardAdministrateur from '../../components/layout/admin/Navbar';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PromoCard from '../../components/common/PromoCard';
import PromoHeader from '../../components/layout/admin/PromoHeader';
import CardBox from '../../components/common/Card';
import ListePointage from '../../components/func/vigile/ListePointage';
import { useUserWithRoles } from '../../lib/utils/hooks/useUserWithRoles';


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
  
  const [pointages, setPointages] = useState([]);
  const [selectedPromoId, setSelectedPromoId] = useState(null);
  const router = useRouter();
  const { user, loading } = useUserWithRoles(['Administrateur']);

  // Rediriger vers la page de la promotion sélectionnée
  const handlePromoClick = (promoId) => {
    router.push(`/admins/promos/${promoId}`);
  };



  const { data: FabriquesData } = useSWR(
    user ? `${process.env.NEXT_PUBLIC_API_URL}/fabriques` : null,
    fetcher
  );
  const fabriques = FabriquesData ? FabriquesData : [];
  console.log('Fabriques', fabriques);

  const ITEMS_PER_PAGE = 6;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(fabriques.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedFabriques = fabriques.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const [loadingP, setLoadingP] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPointages = async () => {
      try {
        // Retrieve the token from localStorage or wherever it's stored
        const token = localStorage.getItem('token'); // Adjust this to how you're managing tokens

        // Fetch pointages with the token included in the headers
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pointages/aujourdhui`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Erreur lors de la récupération des pointages.'
          );
        }

        setPointages(data.pointages);
        setLoadingP(false);
      } catch (error) {
        setError(error.message);
        setLoadingP(false);
      }
    };

    fetchPointages();
  }, []);

  if (loading) {
    return (
      <Center>
        <Spinner size="lg" color="red.500" />
      </Center>
    );
  }
  if (loadingP) {
    return (
      <Center>
        <Spinner size="lg" color="red.500" />
      </Center>
    );
  }


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
        <CardBox
          as="section"
          px={{ base: '2px', md: '3px', lg: '20px' }}
          mx={{ base: '2px', md: '3px', lg: '10px' }}
         
          maxW={{ base: '366px', md: '100%', lg: '100%' }}
         
          display={{ base: 'none', md: 'none', lg: 'block' }}
        ></CardBox>
        <CardBox
        
        >
          {' '}
          <PromoHeader />
          <Text color="red.500">Aucune promotion</Text>{' '}
        </CardBox>
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
      {/* <CardBox
        as="section"
       
        maxW={{ base: '366px', md: '100%', lg: '90%' }}
     
        display={{ base: 'block', md: 'block', lg: 'block' }}
      >
        
        
        ;
      </CardBox> */}
        {/* Add Fabrique and Formation Forms */}
        <CardBox
          as="section"
          px={{ base: '2px', md: '30px', lg: '20px' }}
          ml={{ base: '2px', md: '20px', lg: '120px' }}
      
          maxW={{ base: '100%', lg: '90%' }}
       
        >
          <Box>
            {/* <Flex
              justifyContent="space-between"
              alignItems="center"
              overflow="hidden"
            >
              <Button onClick={handlePrevPage} isDisabled={currentPage === 1}>
                Précédent
              </Button>

              {selectedFabriques?.length > 0 ? (
                selectedFabriques.map((fabrique) => (
                  <Box key={fabrique.id} mx={4} textAlign="center">
                    <Image
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/4ab18d4eb620294560328c98d7834f71abf167307ffbe85a4a9b42def28b575c?placeholderIfAbsent=true&apiKey=5a4129e8dacc4e7b95518ebfcb6a026b"
                      alt={fabrique.nom}
                      boxSize="50px"
                      borderRadius="md"
                      mx={8}
                    />
                    <Text mt={2}>{fabrique.nom}</Text>
                  </Box>
                ))
              ) : (
                <Text>Aucune formation disponible.</Text>
              )}
              <Button
                onClick={handleNextPage}
                isDisabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </Flex> */}
          </Box>
          <SimpleGrid columns={[1]} spacing={4}>
            {/* Add Fabrique Form */}
            <Box>
              {loading ? (
                <Text>Chargement des pointages...</Text>
              ) : error ? (
                <Text>Erreur : {error}</Text>
              ) : pointages.length === 0 ? (
                <Text>{`Aucun pointage pour aujourd'hui.`}</Text>
              ) : (
                <ListePointage pointages={pointages} />
              )}
            </Box>
          </SimpleGrid>
        </CardBox>

      <CardBox
        as="section"
        px={{ base: '2px', md: '3px', lg: '20px' }}
     
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
          <PromoCard promos={promosTerminer} isCompleted handlePromoClick={handlePromoClick} />
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
