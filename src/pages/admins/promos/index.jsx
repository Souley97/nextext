/* eslint-disable no-unused-vars */
import { Box, Center, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import CardBox from '../../../components/common/Card';
import PromoCard from '../../../components/common/PromoCard';
import PointageHebdomadaire from '../../../components/func/admin/PointageHebdomadaire';
import ProfileCardAdministrateur from '../../../components/layout/admin/Navbar';
import PromoHeader from '../../../components/layout/admin/PromoHeader';

// Function to fetch data
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
  const { data: promosData, error: promosError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/promos/encours`,
    fetcher
  );
  const { data: promosDataTerminer, error: promosErrorTerminer } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/promos/terminees`,
    fetcher
  );

  const router = useRouter();

  const handlePromoClick = (promoId) => {
    router.push(`/admins/promos/${promoId}`);
  };

  const { data: assistantsData, error: assistantsError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/formateurs`,
    fetcher
  );
  const assistants = assistantsData ? assistantsData : [];

  const assignAssistant = async (promoId, assistantId) => {
    try {
      const response = await fetch(
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
      }
    } catch (error) {
      console.error("Erreur lors de l'assignation de l'assistant:", error);
    }
  };

  if (promosError || promosErrorTerminer) {
    return (
      <Box p={0}>
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
            <PromoHeader />
            <Text color="red.500">Aucune promotion</Text>
          </Box>
        </SimpleGrid>
      </Box>
    );
  }

  const promos = promosData ? promosData : [];
  const promosTerminer = promosDataTerminer ? promosDataTerminer : [];

  return (
    <Box p={0}>
      <ProfileCardAdministrateur />

      <SimpleGrid
        ml={{ base: '12px', md: '11px', lg: '1px' }}
        justifyContent="center"
        columns={[1, 2]}
        spacing={8}
      >
        <CardBox
          as="section"
          maxW={{ base: '366px', md: '100%', lg: '100%' }}
          display={{ base: 'block', md: 'block', lg: 'block' }}
        >
          <PointageHebdomadaire />
        </CardBox>
        <CardBox
          as="section"
          px={{ base: '2px', md: '3px', lg: '20px' }}
          mx={{ base: '2px', md: '3px', lg: '10px' }}
          py={8}
          mt={7}
          w="full"
          mr={46}
          maxW={{ base: '366px', md: '100%', lg: '60%' }}
        >
          <Center>
            <Heading as='h3'>
              Promos
            </Heading>
          </Center>
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
          )}
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
          )}
        </CardBox>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;