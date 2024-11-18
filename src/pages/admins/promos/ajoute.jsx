import { useState, useEffect } from 'react';
import {
  Center,
  Button,
  Box,
  Text,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import FormInput from '../../../components/common/FormInput';
import FormSelect from '../../../components/common/FormSelect';
import ProfileCardAdministrateur from '../../../components/layout/admin/Navbar';
import PromoHeader from '../../../components/common/PromoHeader';
import Link from 'next/link';

const CreatePromoForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    date_debut: '',
    date_fin: '',
    fabrique_id: '',
    chef_projet_id: '',
    formation_id: '',
    formateur_id: '',
    
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const [fabriques, setFabriques] = useState([]);
  const [chefsProjets, setChefsProjets] = useState([]);
  const [formations, setFormations] = useState([]);

  const getCurrentUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData((prevFormData) => ({
          ...prevFormData,
          formateur_id: data.user.id,
        }));
      } else {
        setErrors({
          general:
            'Erreur lors de la récupération des informations utilisateur.',
        });
      }
    } catch (error) {
      setErrors({
        general: 'Erreur lors de la récupération des informations utilisateur.',
      });
    }
  };

  const fetchOptions = async () => {
    try {
      // eslint-disable-next-line no-undef
      const [fabriquesRes, chefsProjetsRes, formationsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/fabriques`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/chefs-projet`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/formations`),
      ]);

      if (fabriquesRes.ok) setFabriques(await fabriquesRes.json());
      if (chefsProjetsRes.ok) setChefsProjets(await chefsProjetsRes.json());
      if (formationsRes.ok) setFormations(await formationsRes.json());
    } catch (error) {
      setErrors({ general: 'Erreur lors de la récupération des options.' });
    }
  };

  useEffect(() => {
    getCurrentUser();
    fetchOptions();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = 'Le nom est requis.';
    if (!formData.date_debut)
      newErrors.date_debut = 'La date de début est requise.';
    if (!formData.date_fin) newErrors.date_fin = 'La date de fin est requise.';
    if (!formData.fabrique_id)
      newErrors.fabrique_id = 'Veuillez sélectionner une fabrique.';
    if (!formData.chef_projet_id)
      newErrors.chef_projet_id = 'Veuillez sélectionner un chef de projet.';
    if (!formData.formation_id)
      newErrors.formation_id = 'Veuillez sélectionner une formation.';

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/promos`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage('Promotion créée avec succès !');
        setFormData({
          nom: '',
          date_debut: '',
          date_fin: '',
          fabrique_id: '',
          chef_projet_id: '',
          formation_id: '',
          formateur_id: user?.id || '',
        });
      } else {
        setErrors(data.errors || { general: 'Une erreur est survenue.' });
      }
    } catch (error) {
      setErrors({
        general: 'Une erreur est survenue lors de la création de la promotion.',
      });
    }
  };

  return (
    <Center display="block">
      <ProfileCardAdministrateur />

      <SimpleGrid columns={{ sm: 1, md: 2 }}
          mx={{ base:'3px', md: '2px', lg:'42px' }}
          spacing={0} mt={10}>
        <Box
          mt={5}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          width="100%"
          mx={{ base:'3px', md: '2px', lg:'32px' }}
        >
          <form onSubmit={handleSubmit}>
            <SimpleGrid columns={[1, 2]} spacing={4}>
              {/* Champ Nom */}
              <FormInput
                id="nom"
                label="Nom"
                name="nom"
                type="text"
                placeholder="Nom de la promotion"
                value={formData.nom}
                onChange={handleChange}
                error={errors.nom} // Ajout de l'erreur ici
              />
              {/* Sélection de la Formation */}
              <FormSelect
                id="formation_id"
                label="Formation"
                name="formation_id"
                value={formData.formation_id}
                onChange={handleChange}
                options={formations.map((formation) => ({
                  value: formation.id,
                  label: formation.nom,
                }))}
                error={errors.formation_id} // Ajout de l'erreur ici
              />
              {/* Champ Date de début */}
              <FormInput
                id="date_debut"
                label="Date de début"
                name="date_debut"
                type="date"
                value={formData.date_debut}
                onChange={handleChange}
                error={errors.date_debut} // Ajout de l'erreur ici
              />

              {/* Champ Date de fin */}
              <FormInput
                id="date_fin"
                label="Date de fin"
                name="date_fin"
                type="date"
                value={formData.date_fin}
                onChange={handleChange}
                error={errors.date_fin} // Ajout de l'erreur ici
              />

              {/* Champ Date de fin */}
              <FormInput
                id="horaire"
                label="horaire"
                name="horaire"
                type="time"
                value={formData.horaire}
                onChange={handleChange}
                error={errors.horaire} // Ajout de l'erreur ici
              />

              {/* Sélection de la Fabrique */}
              <FormSelect
                id="fabrique_id"
                label="Fabrique"
                name="fabrique_id"
                value={formData.fabrique_id}
                onChange={handleChange}
                options={fabriques.map((fabrique) => ({
                  value: fabrique.id,
                  label: fabrique.nom,
                }))}
                error={errors.fabrique_id} // Ajout de l'erreur ici
              />

              {/* Sélection du Chef de projet */}
              <FormSelect
                id="chef_projet_id"
                label="Chef de Projet"
                name="chef_projet_id"
                value={formData.chef_projet_id}
                onChange={handleChange}
                options={chefsProjets.map((chef) => ({
                  value: chef.id,
                  label: chef.nom,
                }))}
                error={errors.chef_projet_id} // Ajout de l'erreur ici
              />

              <Button
                type="submit"
                mx="auto"
                color="white"
                bg="#CE0033"
                width="full"
              >
                Créer Promotion
              </Button>
            </SimpleGrid>
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
        </Box>
        <Box
          mt={5}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          width="97%"
          mx={2}
        >
          <VStack spacing={0}>
            <PromoHeader />

            {/* Choix d'ajout d'apprenants */}
            <Text mt={4} fontWeight="bold">
              Ajouter des Apprenants :
            </Text>
            <SimpleGrid  justifyContent="center" spacing={2} mt={2}  >
              <Link  href="/admins/apprenants/inscriptions/excel" isExternal>
                <Button bg='#CE0033' my={4} color="white">Ajouter par Excel</Button>
              </Link>
              <Link
                href="/admins/apprenants/inscriptions/formulaire"
                isExternal
              >
              <Button  
              _hover={{ bg: '#110033' }}
              color="white"
              bg="#CE0033"
              width="50%"
              >Ajouter par Formulaire</Button>
              </Link>
            </SimpleGrid>
          </VStack>
        </Box>
      </SimpleGrid>
    </Center>
  );
};

export default CreatePromoForm;
