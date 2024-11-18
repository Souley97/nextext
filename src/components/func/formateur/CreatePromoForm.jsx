import { Box, Button, SimpleGrid, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import FormInput from '../../common/FormInput';
import FormSelect from '../../common/FormSelect';
import useSWR from 'swr';

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
  const [formData, setFormData] = useState({
    nom: '',
    date_debut: '',
    date_fin: '',
    horaire:'',
    fabrique_id: '',
    chef_projet_id: '',
    formation_id: '',
    formateur_id: '',
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);

  const { data: fabriques } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/fabriques`, fetcher);
  const { data: chefsProjets } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/chefs-projet`, fetcher);
  const { data: formations } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/formations`, fetcher);

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

  useEffect(() => {
    getCurrentUser();
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
          horaire: '',
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

      
        <Box
          mt={3}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          width="100%"
        >
            <form onSubmit={handleSubmit}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {/* Champ Nom */}
              <FormInput
                id="nom"
                label="Nom"
                name="nom"
                type="text"
                placeholder="Nom de la promotion"
                value={formData.nom}
                onChange={handleChange}
                error={errors.nom}
              />
              {/* Sélection de la Formation */}
              <FormSelect
                id="formation_id"
                label="Formation"
                name="formation_id"
                value={formData.formation_id}
                onChange={handleChange}
                options={formations ? formations.map((formation) => ({
                  value: formation.id,
                  label: formation.nom,
                })) : []}
                error={errors.formation_id}
              />
              {/* Champ Date de début */}
              <FormInput
                id="date_debut"
                label="Date de début"
                name="date_debut"
                type="date"
                value={formData.date_debut}
                onChange={handleChange}
                error={errors.date_debut}
              />
              {/* Champ Date de fin */}
              <FormInput
                id="date_fin"
                label="Date de fin"
                name="date_fin"
                type="date"
                value={formData.date_fin}
                onChange={handleChange}
                error={errors.date_fin}
              />
              {/* Champ Horaire Pointage */}
                 <FormInput
                id="horaire"
                label="Horaire Pointage"
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
                options={fabriques ? fabriques.map((fabrique) => ({
                  value: fabrique.id,
                  label: fabrique.nom,
                })) : []}
                error={errors.fabrique_id}
              />
              {/* Sélection du Chef de projet */}
              <FormSelect
                id="chef_projet_id"
                label="Chef de Projet"
                name="chef_projet_id"
                value={formData.chef_projet_id}
                onChange={handleChange}
                options={chefsProjets ? chefsProjets.map((chef) => ({
                  value: chef.id,
                  label: chef.nom,
                })) : []}
                error={errors.chef_projet_id}
              />
             
            </SimpleGrid>
            <Button
                type="submit"
                width="full"
                py={6}
                _hover={{ bg: 'gray.600' }}
                bg="#CE0033"
                my={8}
                color="white"
                w="50%"
                mx="25%"
              >
                Créer Promotion
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
        </Box>
  );
};

export default CreatePromoForm;
