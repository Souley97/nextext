import { useState } from 'react';
import { Center, Button, Input, FormControl, FormLabel, Box, Text } from '@chakra-ui/react';
import ProfileCardAdministrateur from '../../../components/layout/admin/Navbar';

const InscrireAppprenantExel = () => {
  const [file, setFile] = useState(null);
  const [promoId, setPromoId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

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
      } else {
        setError(result.error || 'Une erreur est survenue.');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de l\'importation.');
    }
  };

  return (
    <Center display={'block'}>
      <ProfileCardAdministrateur />

      <Box mt={5} p={5} shadow="md" borderWidth="1px" borderRadius="lg" width="100%" maxWidth="500px">
        <form onSubmit={handleSubmit}>
          <FormControl id="promo_id" mb={4} isRequired>
            <FormLabel>Promotion ID</FormLabel>
            <Input
              type="text"
              placeholder="Saisir l'ID de la promotion"
              value={promoId}
              onChange={(e) => setPromoId(e.target.value)}
            />
          </FormControl>

          <FormControl id="file" mb={4} isRequired>
            <FormLabel>Fichier Excel</FormLabel>
            <Input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
          </FormControl>

          <Button type="submit" colorScheme="red" width="full">
            Importer Apprenants
          </Button>
        </form>

        {message && (
          <Text mt={4} color="green.500">
            {message}
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
