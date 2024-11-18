/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, Select, useToast } from '@chakra-ui/react';
import { api } from '../../../lib/utils/api';

const CongeForm = () => {
  const [conges, setConges] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    type: '',
    date_debut: '',
    date_fin: '',
    motif: ''
  });
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      // Correction : envoie de formData dans le corps de la requête
      const response = await api('conges', 'POST', formData); 

      if (response) {
        setConges((prevConges) => [...prevConges, response.conger]);

        toast({
          title: 'Demande de congé envoyée.',
          description: "Votre demande est en attente d'approbation.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Réinitialiser le formulaire après soumission
        setFormData({
          type: '',
          date_debut: '',
          date_fin: '',
          motif: ''
        });
      }
      
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue lors de l'envoi de la demande.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} maxW="md" mx="auto" p={5} borderWidth={1} borderRadius="md" boxShadow="md">
      <FormControl id="type" mb={4} isRequired>
        <FormLabel>Type de congé</FormLabel>
        <Select name="type" value={formData.type} onChange={handleChange} placeholder="Sélectionnez un type">
          <option value="congé">Congé</option>
          <option value="permission">Permission</option>
        </Select>
      </FormControl>


      <FormControl id="date_debut" mb={4} isRequired>
        <FormLabel>Date de début</FormLabel>
        <Input type="date" name="date_debut" value={formData.date_debut} onChange={handleChange} />
      </FormControl>

      <FormControl id="date_fin" mb={4}>
        <FormLabel>Date de fin</FormLabel>
        <Input type="date" name="date_fin" value={formData.date_fin} onChange={handleChange} />
      </FormControl>

      <FormControl id="motif" mb={4}>
        <FormLabel>Motif</FormLabel>
        <Textarea name="motif" value={formData.motif} onChange={handleChange} placeholder="Optionnel" />
      </FormControl>

      
      <Button
                type="submit"
                mx="auto"
                h={14}
                color="white"
                bg="#CE0033"
                width="full"
                _hover={{bg:"#110033"}}
              

              >Soumettre</Button>
    </Box>
  );
};

export default CongeForm;
