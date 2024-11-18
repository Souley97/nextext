import { useState, useEffect } from 'react';
import { Box, Heading, List, ListItem, Text, Badge, Button, Spinner, useToast, Fade } from '@chakra-ui/react';
import { api } from '../../../lib/utils/api';
import Swal from 'sweetalert2'; // Importation de SweetAlert2
import { MdDeleteSweep } from "react-icons/md";
const CongeList = () => {
  const [conges, setConges] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Récupération des congés
  const fetchConges = async () => {
    setLoading(true);
    try {
      const response = await api('mes/conges', 'GET');
      setConges(response);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Erreur lors de la récupération des congés.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'un congé
  const deleteConge = async (id) => {
    // Utilisation de SweetAlert2 pour la confirmation
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ce0033',
      cancelButtonColor: '#gray.300',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      try {
        await api(`conges/${id}`, 'DELETE');
        toast({
          title: 'Succès',
          description: "Le congé a été supprimé avec succès.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Mise à jour de la liste des congés après la suppression
        setConges((prevConges) => prevConges.filter(conge => conge.id !== id));
      } catch (error) {
        toast({
          title: 'Erreur',
          description: "Erreur lors de la suppression du congé.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    fetchConges();
  }, []);

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box maxW="md" mx="auto" p={5} borderWidth={1} borderRadius="md" boxShadow="md">
      <Heading as="h2" size="lg" mb={5}>Liste mes congés</Heading>
      <List spacing={3}>
        {conges.length > 0 ? (
          conges.map((conge) => (
            <Fade key={conge.id} in={true} transition={{ enter: { duration: 0.5 } }}>
              <ListItem borderWidth={1} p={4} borderRadius="md" _hover={{ bg: 'gray.100' }}>
                <Text><strong>Type :</strong> {conge.type}</Text>
                <Text><strong>Date début :</strong> {conge.date_debut}</Text>
                <Text><strong>Date fin :</strong> {conge.date_fin || 'Non définie'}</Text>
                <Text><strong>Motif :</strong> {conge.motif || 'Aucun'}</Text>
                <Badge colorScheme={conge.status === 'approuvée' ? 'green' : conge.status === 'rejetée' ? 'red' : 'yellow'}>
                  {conge.status}
                </Badge>
                {/* Ajout d'un bouton pour la suppression du congé */}
                {conge.status !== 'approuvée' && conge.status !== 'rejetée' && (
                  <Button 
                    colorScheme="red" 
                    size="md" 
                    mt={2}
                    ml={32}
                    onClick={() => deleteConge(conge.id)}
                  >
                    
                    <MdDeleteSweep  size="md" />
                    
                  </Button>
                )}
              </ListItem>
            </Fade>
          ))
        ) : (
          <Text>Aucun congé trouvé.</Text>
        )}
      </List>
    </Box>
  );
};

export default CongeList;
