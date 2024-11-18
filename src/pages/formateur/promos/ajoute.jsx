/* eslint-disable no-undef */
import { useState } from 'react';
import {
  Center,
  Button,
  Box,
  Text,
  SimpleGrid,
  VStack,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import useSWR from 'swr';
import ProfileCardFormateur from '../../../components/layout/formateur/Navbar';
import PromoHeader from '../../../components/common/PromoHeader';
import Link from 'next/link';
import axios from 'axios';
import CardBox from '../../../components/common/Card';

const fetcher = (url) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Erreur lors de la récupération des données.');
    return res.json();
  });

  const CreatePromoForm = () => {
    const { data: promosData, error: promosError } = useSWR(
      `${process.env.NEXT_PUBLIC_API_URL}/promos/encours`,
      fetcher
    );
    const { data: promosDataTerminer, error: promosErrorTerminer } = useSWR(
      `${process.env.NEXT_PUBLIC_API_URL}/promos/terminer`,
      fetcher
    );
  
    const [selectedPromo, setSelectedPromo] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    const handlePromoClick = async (promoId) => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/promos/${promoId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setSelectedPromo(response.data);
        onOpen();
      } catch (err) {
        console.error('Erreur lors de la récupération des détails de la promo :', err);
        alert("Impossible de charger les détails de cette promotion.");
      }
    };
  
    // Logs pour vérification des données
    console.log("promosData :", promosData);
    console.log("promosDataTerminer :", promosDataTerminer);
  
    if (promosError || promosErrorTerminer) {
      return (
        <Center h="100vh">
          <Text color="red.500">Erreur lors du chargement des promotions.</Text>
        </Center>
      );
    }
  
    if (!promosData || !promosDataTerminer) {
      return (
        <Center h="100vh">
          <Spinner size="lg" color="red.500" />
        </Center>
      );
    }
  
    // Utilisation sécurisée des données
    const promosEnCours = promosData?.promos || [];
    const promosTerminees = promosDataTerminer?.promos || [];
  
    return (
      <Center display="block">
        <ProfileCardFormateur />
        <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={8} mt={10}>
          <CardBox p={5} shadow="md"
                    maxW={{ base: '100%', md: '100%', lg: '85%' }}

                    >

      
            <Text fontSize="2xl" fontWeight="bold">Promotions en Cours</Text>
            {promosEnCours.length > 0 ? (
              <PromoCard promos={promosEnCours} handlePromoClick={handlePromoClick} />
            ) : (
              <Text color="red.500">Aucune promotion en cours.</Text>
            )}
  
            <Text fontSize="2xl" fontWeight="bold" mt={4}>Promotions Terminées</Text>
            {promosTerminees.length > 0 ? (
              <PromoCard promos={promosTerminees} handlePromoClick={handlePromoClick} />
            ) : (
              <Text color="red.500">Aucune promotion terminée.</Text>
            )}
          </CardBox>

          <CardBox
          mt={5}
          p={5}
          shadow="md"
        
          maxW={{ base: '100%', md: '100%', lg: '75%' }}
          ml={{ base: '0%', md: '0%', lg: '7%' }}
        >
          <VStack spacing={4}>
            <PromoHeader />
            <Text mt={4} fontWeight="bold">
              Ajouter des Apprenants :
            </Text>
            <SimpleGrid justifyContent="center" spacing={2} mt={2}>
              <Link href="/formateur/apprenants/inscriptions/excel" passHref>
                <Button bg="#CE0033" my={4} color="white">
                  Ajouter par Excel
                </Button>
              </Link>
              <Link href="/formateur/apprenants/inscriptions/formulaire" passHref>
                <Button bg="#CE0033" color="white">
                  Ajouter par Formulaire
                </Button>
              </Link>
            </SimpleGrid>
          </VStack>
        </CardBox>
        </SimpleGrid>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Détails de la Promo</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            {selectedPromo ? (
              <Box>
                <Text fontSize="xl" fontWeight="bold">
                  {selectedPromo.promo.nom}
                </Text>
                {selectedPromo.apprenants.map((apprenant, index) => (
                  <Text key={apprenant.id}>
                    {/* index 1, 2 ... */}
                    {index + 1}. {apprenant.nom} {apprenant.prenom}
                  </Text>
                ))}
              </Box>
            ) : (
              <Text>Chargement des détails...</Text>
            )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Center>
    );
  };
  

const PromoCard = ({ promos, handlePromoClick }) => {
  return (
    <>
      {promos.map((promo) => (
        <Box key={promo.id} p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Text fontSize="xl" fontWeight="bold">
          {promo.index}  {promo.nom}
          </Text>
          <Button mt={4} bg="#CE0033" color="white" onClick={() => handlePromoClick(promo.id)}>
            Liste des apprenants
          </Button>
        </Box>
      ))}
    </>
  );
};

export default CreatePromoForm;
