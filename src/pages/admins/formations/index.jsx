import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import FormInput from '../../../components/common/FormInput';
import FormationCard from '../../../components/func/admin/FormationCard';
import PromoCard from '../../../components/func/admin/PromoCard';
import ProfileCardAdministrateur from '../../../components/layout/admin/Navbar';
import { useUserWithRoles } from '../../../lib/utils/hooks/useUserWithRoles';

// Fetcher function for SWR
const fetcher = (url) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Erreur lors de la récupération des données.');
    return res.json();
  });

const AdminPage = () => {
  const [message, setMessage] = useState('');

  const { user, loading } = useUserWithRoles(['Administrateur']);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [formData, setFormData] = useState({ nom: '', localisation: '' });
  const [errors, setErrors] = useState({ nom: '', localisation: '' });
  const [formDataFormation, setFormDataFormation] = useState({ nom: '' });
  const [errorsFormation, setErrorsFormation] = useState({ nom: '' });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleChangeFormation = (e) => {
    const { name, value } = e.target;
    setFormDataFormation({ ...formDataFormation, [name]: value });
  };

  const handleSubmitFormation = async (e) => {
    e.preventDefault();
    let newErrors = {};
    setIsLoading(true);

    if (!formDataFormation.nom) newErrors.nom = 'Le nom est requis';

    if (Object.keys(newErrors).length > 0) {
      setErrorsFormation(newErrors);
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/formations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formDataFormation),
      }
    );

    if (response.ok) {
      setMessage(``);

      toast({
        title: 'Succès !',
        description: ' ajoute avec succès.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      console.log('Formation ajoutée :', formDataFormation);
      setFormDataFormation({ nom: '' });
      setErrorsFormation({ nom: '' });
      // Optionally refresh the list of formations here
    } else {
      console.error('Erreur lors de l’ajout de la formation');
      toast({
        title: 'error !',
        description: ' Erreur lors de l’ajout de la formation .',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmitFabrique = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.nom) newErrors.nom = 'Le nom est requis';
    if (!formData.localisation)
      newErrors.localisation = 'La localisation est requise';

    // error messages

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/fabriques`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      setMessage(``);

      toast({
        title: 'Succès !',
        description: ' ajoute avec succès.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setFormData({ nom: '', localisation: '' });
      setErrors({ nom: '', localisation: '' });
      // Optionally refresh the list of fabriques here
    } else {
      false;
      console.error('Erreur lors de l’ajout de la fabrique');
      toast({
        title: 'error !',
        description: ' Erreur lors de l’ajout de la fabrique .',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  // const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openModal = () => {
    setIsOpen(true);
  };

  // Fetch formations using SWR
  const { data: FormationsData, error: FormationsError } = useSWR(
    user ? `${process.env.NEXT_PUBLIC_API_URL}/formations` : null,
    fetcher
  );
  const formations = FormationsData ? FormationsData : [];

  const handleSelectFormation = (formation) => {
    setSelectedFormation(formation);
    openModal();
  };

  useEffect(() => {
    console.log(selectedFormation);
  }, [selectedFormation]);

  if (FormationsError) {
    return <p>Erreur lors de la récupération des formateurs.</p>;
  }
  const handleDeleteFormation = async (formationId) => {
    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir supprimer cette formation ?'
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/formations/${formationId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        // Remove the deleted formation from the state
      } else {
        console.error('Erreur lors de la suppression de la formation');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la formation:', error);
    }
  };

  if (loading) {
    return (
      <Center>
        <Spinner size="lg" color="red.500" />
      </Center>
    );
  }

  // Handle error during fetch
  if (FormationsError) {
    return <Text>Erreur lors de la récupération des formations.</Text>;
  }

  // Handle user not authenticated
  if (!user) {
    return <Text>Une erreur est survenue. Veuillez vous reconnecter.</Text>;
  }

  return (
    <Center display="block">
      {/* Profile Card */}
      <ProfileCardAdministrateur />

      <SimpleGrid
        mx={{ base: '2px', md: '13px', lg: '12px' }}
        justifyContent="space-between"
        columns={[1, 2]}
        spacing={2}
      >
        {/* Add Fabrique and Formation Forms */}
        <Box
          as="section"
          px={{ base: '2px', md: '30px', lg: '20px' }}
          mx="auto"
          py={8}
          mt={7}
          ml={{ base: '0%', md: '20px', lg: '17%' }}
          w="full"
          maxW={{ base: '100%', lg: '96%' }}
          borderBottom="2px solid"
          borderTop="2px solid"
          borderColor="#CE0033"
          borderRadius="md"
          shadow="lg"
          bg="whiteAlpha.80"
          fontFamily="Nunito Sans"
        >
          <SimpleGrid columns={[1, 2]} spacing={4}>
            {/* Add Fabrique Form */}
            <Box
              mt={5}
              p={5}
              borderRadius="lg"
              borderColor="#CE0033"
              borderTop="2px"
              borderBottom="2px"
              shadow="lg"
            >
              <Heading size="md" as="h3">
                Ajouter un Fabrique
              </Heading>
              <form onSubmit={handleSubmitFabrique}>
                <FormInput
                  placeholder="Nom"
                  id="nom"
                  label="Nom"
                  name="nom"
                  type="text"
                  value={formData.nom}
                  onChange={handleChange}
                  error={errors.nom}
                />
                <FormInput
                  placeholder="Localisation"
                  id="Localisation"
                  label="Localisation"
                  name="localisation"
                  type="text"
                  value={formData.localisation}
                  onChange={handleChange}
                  error={errors.localisation}
                />
                <Button
                  type="submit"
                  color="white"
                  _hover={{ bg: 'gray.600' }}
                  bg="#CE0033"
                  width="full"
                >
                  Ajouter
                </Button>
              </form>
            </Box>

            {/* Add Formation Form */}
            <Box
              mt={5}
              p={5}
              borderRadius="lg"
              borderColor="#CE0033"
              borderTop="2px"
              borderBottom="2px"
              shadow="lg"
            >
              <Heading size="md" as="h3">
                Ajouter une Formation
              </Heading>
              <form onSubmit={handleSubmitFormation}>
                <FormInput
                  placeholder="Nom de la formation"
                  id="nomFormation"
                  label="Nom"
                  name="nom"
                  type="text"
                  value={formDataFormation.nom}
                  onChange={handleChangeFormation}
                  error={errorsFormation.nom}
                />
                <Button
                  type="submit"
                  _hover={{ bg: 'gray.600' }}
                  color="white"
                  bg="#CE0033"
                  width="full"
                >
                  Ajouter
                </Button>
              </form>
            </Box>
            {message && (
              <Text mt={4} color="green.500">
                {message}
              </Text>
            )}
            {errors.general && (
              <Text mt={4} color="red.500">
                {errors.general}
              </Text>
            )}
          </SimpleGrid>
        </Box>

        {/* Display Formations */}
        <Box
          as="section"
          px={{ base: '2px', md: '30px', lg: '20px' }}
          mx="auto"
          py={8}
          mt={7}
          w="full"
          maxW={{ base: '100%', lg: '60%' }}
          borderBottom="2px solid"
          borderTop="2px solid"
          borderColor="#CE0033"
          borderRadius="md"
          shadow="lg"
          bg="whiteAlpha.80"
          fontFamily="Nunito Sans"
        >
          <Flex justifyContent="space-between">
            <Heading as="h1" size="md" fontWeight="semibold">
              Formations
            </Heading>

            <Link href="/admins/formations" mx={4} my={1}>
              <svg width="48" height="48" fill="#CE0033">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.8108 1.38174C19.5768 0.411166 28.4232 0.411166 37.1891 1.38174C42.0426 1.92574 45.9583 5.7479 46.5278 10.6184C47.5666 19.5094 47.5666 28.4911 46.5278 37.3821C45.9583 42.2526 42.0426 46.0747 37.1891 46.6187C28.4232 47.5893 19.5768 47.5893 10.8108 46.6187C5.95731 46.0747 2.04165 42.2526 1.47215 37.3821C0.433601 28.492 0.433601 19.5113 1.47215 10.6212C1.7602 8.25503 2.83889 6.05545 4.53337 4.37896C6.22786 2.70248 8.43884 1.64734 10.808 1.38457M24 9.8534C24.5636 9.8534 25.1041 10.0773 25.5026 10.4758C25.9011 10.8743 26.125 11.4148 26.125 11.9784V21.8752H36.0218C36.5854 21.8752 37.1259 22.0991 37.5244 22.4976C37.9229 22.8961 38.1468 23.4366 38.1468 24.0002C38.1468 24.5638 37.9229 25.1043 37.5244 25.5028C37.1259 25.9013 36.5854 26.1252 36.0218 26.1252H26.125V36.0221C26.125 36.5857 25.9011 37.1262 25.5026 37.5247C25.1041 37.9232 24.5636 38.1471 24 38.1471C23.4364 38.1471 22.8959 37.9232 22.4974 37.5247C22.0989 37.1262 21.875 36.5857 21.875 36.0221V26.1252H11.9782C11.4146 26.1252 10.8741 25.9013 10.4756 25.5028C10.0771 25.1043 9.85322 24.5638 9.85322 24.0002C9.85322 23.4366 10.0771 22.8961 10.4756 22.4976C10.8741 22.0991 11.4146 21.8752 11.9782 21.8752H21.875V11.9784C21.875 11.4148 22.0989 10.8743 22.4974 10.4758C22.8959 10.0773 23.4364 9.8534 24 9.8534"
                />
              </svg>
            </Link>
          </Flex>

          <SimpleGrid columns={1} spacing={4}>
            {formations?.length > 0 ? (
              formations.map((formation) => (
                <FormationCard
                  key={formation.id}
                  formation={formation}
                  onClick={openModal}
                  colorScheme="blue"
                  onSelect={() => handleSelectFormation(formation)}
                  onDelete={() => handleDeleteFormation(formation.id)} // Pass the delete handler
                />
              ))
            ) : (
              <Text>Aucune formation disponible.</Text>
            )}
          </SimpleGrid>
        </Box>
      </SimpleGrid>
      {selectedFormation && (
        <Box>
          {/* Modal Popup */}
          <Modal mx isOpen={isOpen} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent mx={2}>
              <ModalCloseButton />
              <ModalBody>
                {selectedFormation && (
                  <>
                    <Text fontWeight="bold">
                      Formation : {selectedFormation.nom}
                    </Text>

                    <SimpleGrid columns={1} spacing={4} mt={4}>
                      {selectedFormation.promos?.length > 0 ? (
                        selectedFormation.promos.map((promo) => (
                          <Link
                            href={`/admins/promos/${promo.id}`}
                            key={promo.id}
                          >
                            <PromoCard promo={promo} />
                          </Link>
                        ))
                      ) : (
                        <Text>Aucune promotion pour cette formation.</Text>
                      )}
                    </SimpleGrid>
                  </>
                )}
              </ModalBody>

              <ModalFooter></ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}
    </Center>
  );
};

export default AdminPage;
