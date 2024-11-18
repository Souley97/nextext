import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Select, useToast } from '@chakra-ui/react';
import { api } from '../../../lib/utils/api'; // Assurez-vous que ce chemin est correct
const CongeUpdateStatus = ({ congeId, onClose, onUpdateSuccess }) => {

  const [status, setStatus] = useState('');
  const toast = useToast();

  const handleChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api(`conges/${congeId}/status`, 'PATCH', { status });
      if (response) {
        toast({
          title: 'Statut mis à jour.',
          description: "Le statut du congé a été mis à jour avec succès.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onUpdateSuccess(); // Call update success handler
        onClose(); // Ferme le modal après la mise à jour
      }}catch (error) {
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue lors de la mise à jour du statut.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };


  return (
    <Box as="form" onSubmit={handleSubmit} maxW="md" mx="auto" p={5} borderWidth={1} borderRadius="md" boxShadow="md">
      <FormControl id="status" mb={4} isRequired>
        <FormLabel>Statut</FormLabel>
        <Select value={status} onChange={handleChange} placeholder="Sélectionnez un statut">
          <option value="approuvée">Approuvée</option>
          <option value="rejetée">Rejetée</option>
        </Select>
      </FormControl>

      <Button type="submit" color="white"  bg="#CE0033" _hover={{ bg:"gray.600"}} my={5} width="full">Mettre à jour</Button>
    </Box>
  );
};

export default CongeUpdateStatus;
