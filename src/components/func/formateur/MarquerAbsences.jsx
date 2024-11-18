import {  useState } from 'react';
import { api } from '../../../lib/utils/api'; // Assurez-vous que 'api' est bien défini dans vos utils
import { Box, Button, Text } from '@chakra-ui/react';
import { mutate } from 'swr';

export default function MarquerAbsences() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const marquerAbsences = async () => {
    setIsLoading(true); // Démarrer le chargement
    setMessage(null); // Réinitialiser le message précédent

    try {
      const response = await api('marquer-absences', 'POST');

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        mutate(`${process.env.NEXT_PUBLIC_API_URL}/user/me`);

      } else {
        setMessage(data.message || 'Erreur lors du marquage des absences');
      }
    } catch (error) {
      setMessage('Une erreur est survenue lors de la requête.');
    } finally {
      setIsLoading(false); // Finir le chargement
    }
  };



  return (
    <Box className="marquer-absences">

      <Button
       onClick={() => { 
        marquerAbsences();
    }} 
        disabled={isLoading} // Désactiver le bouton pendant le chargement
        className="btn btn-primary"
      >
        {isLoading ? 'Chargement...' : 'Marquer les absences'}
      </Button>

      {message && <Text>{message}</Text>}
    </Box>
  );
}
