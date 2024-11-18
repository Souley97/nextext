import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import CardBox from '../../../components/common/Card';
import FormInput from '../../../components/common/FormInput';
import FormSelect from '../../../components/common/FormSelect';
import UserList from '../../../components/common/UserList';
import ProfileCardAdministrateur from '../../../components/layout/admin/Navbar';

const fetcher = (url) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Erreur lors de la récupération des données.');
    return res.json();
  });

const AjouteFormateurPage = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    adresse: '',
    telephone: '',
    email: '',
    password: '',
    sexe: '',
    promotion_id: '',
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [filterType, setFilterType] = useState('Formateur');
  const [role, setRole] = useState('Formateur'); // State for role
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFormateur, setSelectedFormateur] = useState(null); // Add this line

  // Fetch formateurs
  const { data: formateursData, error: formateursError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/personnels/listes`,
    fetcher
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Role-based endpoint selection
    let endpoint = '';
    if (role === 'Formateur') {
      endpoint = `${process.env.NEXT_PUBLIC_API_URL}/formateur/inscrire`;
    } else if (role === 'ChefDeProjet') {
      endpoint = `${process.env.NEXT_PUBLIC_API_URL}/chef-de-projet/inscrire`;
    } else if (role === 'Vigile') {
      endpoint = `${process.env.NEXT_PUBLIC_API_URL}/vigile/inscrire`;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`${role} inscrit avec succès !`);
        toast({
          title: 'Succès !',
          description: `${role} a été inscrit avec succès.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
        setFormData({
          nom: '',
          prenom: '',
          adresse: '',
          telephone: '',
          email: '',
          password: '',
          sexe: '',
          promotion_id: '',
        });
        mutate(`${process.env.NEXT_PUBLIC_API_URL}/formateurs`); // Add mutate to refresh data
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: 'Une erreur est survenue.' });
        }
        setIsLoading(false);
      }
    } catch (error) {
      setErrors({ general: "Une erreur est survenue lors de l'inscription." });
      setIsLoading(false);
    }
  };

  const formateurs = formateursData ? formateursData.formateurs : [];
const filteredUsers = Array.isArray(formateurs)
  ? formateurs.filter((user) =>
      filterType === 'Formateur'
        ? user.role === 'Formateur'
        : filterType === 'ChefDeProjet'
        ? user.role === 'ChefDeProjet'
        : user.role === 'Vigile'
    ) : [];

  const handleSelectFormateur = (formateur) => {
    setSelectedFormateur(formateur); // Update selected formateur
  };

  if (formateursError) {
    return <p>Erreur lors de la récupération des formateurs.</p>;
  }

  return (
    <Center display={'block'}>
      <ProfileCardAdministrateur />

      <SimpleGrid
        mx={{ base: '2px', md: '13px', lg: '12px' }}
        justifyContent="space-between"
        columns={[1, 2]}
        spacing={2}
      >
        <CardBox maxW={{ base: '100%', md: '100%', lg: '90%' }}>
          <Heading justifyContent="center" mx="41%" as="h2" size="md" mb={4}>
            {role}
          </Heading>
          <Box mx="25%">
            <FormSelect
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { value: 'Formateur', label: 'Formateur' },
                { value: 'ChefDeProjet', label: 'Chef de Projet' },
                { value: 'Vigile', label: 'Vigile' }, // Added role Vigile
              ]}
              error={errors.role}
            />
          </Box>
          <form onSubmit={handleSubmit}>
            <SimpleGrid columns={[1, 2]} spacing={4}>
              <FormInput
                id="nom"
                label="Nom"
                name="nom"
                type="text"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleChange}
                error={errors.nom}
              />
              <FormInput
                id="prenom"
                label="Prénom"
                name="prenom"
                type="text"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={handleChange}
                error={errors.prenom}
              />
              <FormInput
                id="adresse"
                label="Adresse"
                name="adresse"
                type="text"
                placeholder="Adresse"
                value={formData.adresse}
                onChange={handleChange}
                error={errors.adresse}
              />
              <FormInput
                id="telephone"
                label="Téléphone"
                name="telephone"
                type="text"
                placeholder="Téléphone"
                value={formData.telephone}
                onChange={handleChange}
                error={errors.telephone}
              />
              <FormInput
                id="email"
                label="Email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <FormSelect
                id="sexe"
                label="Sexe"
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                options={[
                  { value: 'homme', label: 'Homme' },
                  { value: 'femme', label: 'Femme' },
                ]}
                error={errors.sexe}
              />
            </SimpleGrid>

            <Button
              mt={4}
              mx="25%"
              type="submit"
              alignItems="center"
              isLoading={isLoading}
              _hover={{ bg: '#110033' }}
              color="white"
              bg="#CE0033"
              width="50%"
              py={7}
            >
              Inscrire {role}
            </Button>
          </form>

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
        </CardBox>

        <CardBox>
          <Flex
            flex="auto"
            gap={4}
            px={4}
            py={1.5}
            fontWeight="bold"
            justifyContent="space-between"
          >
            <Button
              px={{ base: 2, md: 3, lg: 10 }}
              w="100%"
              py={6}
              fontSize="lg"
              color="white"
              bg={filterType === 'Formateur' ? '#ce0033' : 'gray.500'}
              _hover={{ bg: '#ce0033' }}
              borderRadius="md"
              onClick={() => setFilterType('Formateur')}
            >
              Formateurs
            </Button>
            <Button
              px={{ base: 2, md: 3, lg: 10 }}
              w="100%"
              py={6}
              fontSize="lg"
              color="white"
              bg={filterType === 'ChefDeProjet' ? '#ce0033' : 'gray.500'}
              _hover={{ bg: '#ce0033' }}
              borderRadius="md"
              onClick={() => setFilterType('ChefDeProjet')}
            >
              Chefs de Projet
            </Button>
            <Button
              px={{ base: 2, md: 3, lg: 10 }}
              w="100%"
              py={6}
              fontSize="lg"
              color="white"
              bg={filterType === 'Vigile' ? '#ce0033' : 'gray.500'}
              _hover={{ bg: '#ce0033' }}
              borderRadius="md"
              onClick={() => setFilterType('Vigile')}
            >
              Vigiles
            </Button>
          </Flex>

          <UserList
            users={filteredUsers}
            formateurs={formateurs}
            onSelectFormateur={handleSelectFormateur}
            filterType={filterType}
          />
          {/* <FormateurPromotions formateur={selectedFormateur} /> */}
        </CardBox>
      </SimpleGrid>
    </Center>
  );
};

export default AjouteFormateurPage;
