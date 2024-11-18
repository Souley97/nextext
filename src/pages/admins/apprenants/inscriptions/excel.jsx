import { useState } from 'react';
import { Center, Button, Input, FormControl, FormLabel, Box, Text, useToast } from '@chakra-ui/react';
import useSWR from 'swr';
import FormSelect from '../../../../components/common/FormSelect';
import ProfileCardAdministrateur from '../../../../components/layout/admin/Navbar';

const fetcher = (url) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Erreur lors de la récupération des données.');
    return res.json();
  });

const InscrireAppprenantExel = () => {
  const toast = useToast(); // Hook pour afficher des notifications

  const [file, setFile] = useState(null);
  const [promoId, setPromoId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  // Récupérer les promos en cours et terminées
  const { data: promosData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/promos/encours`,
    fetcher
  );

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !promoId) {
      setError('Veuillez sélectionner un fichier Excel et saisir un ID de promotion.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('promo_id', promoId);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/apprenants/import`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ajoute le token JWT
          },
          body: formData, // Envoie le FormData directement
        }
      );

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message || 'Importation réussie !');
        setError(null);
        toast({
          title: 'Succès !',
          description: 'Les apprenants ont été inscrits avec succès.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        setError(result.error || 'Une erreur est survenue.');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de l\'importation.');
    }
  };

  const promos = promosData ? promosData.promos : [];

  return (
    <Center display={'block'}>
      <ProfileCardAdministrateur />

      <Box mt={5} p={5}borderRadius="lg" width="100%" maxW={{ base:"98%",md: "100%", lg:"40%" }}  borderTop="2px" 
  borderBottom="2px"
    borderColor="#CE0033" 
    // borderColor="red" // Utilisation de la couleur définie dans le thème
  shadow="lg">
        <form onSubmit={handleSubmit}>
          <FormControl id="promo_id" mb={4} isRequired>
            <FormLabel>Promotion ID</FormLabel>
            <FormSelect
              id="promo_id"
              label="ID de la promotion"
              name="promo_id"
              value={promoId} // Utilisation de promoId
              onChange={(e) => setPromoId(e.target.value)} // Met à jour promoId
              options={Array.isArray(promos) ? promos.map((promo) => ({
                value: promo.id,
                label: promo.nom // ou autre champ approprié
              })) : []}
            />
          </FormControl>

          <FormControl id="file" mb={4} isRequired>
            <FormLabel>Fichier Excel</FormLabel>
            <Input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
          </FormControl>

          <Button type="submit" color="white" bg="#CE0033" width="full">
            Importer Apprenants
          </Button>
        </form>

        {message && (
          <Text mt={4} color="green.500">
            
          </Text>
        )}
        {error && (
          <Text mt={4} color="red.500">
            {error}
          </Text>
        )}
      </Box>
    </Center>
  );
};

export default InscrireAppprenantExel;
