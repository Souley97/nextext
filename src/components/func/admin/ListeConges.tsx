import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Badge,
  Spinner,
  useToast,
  SimpleGrid,
  Flex,
  Stack,
  Icon,
} from '@chakra-ui/react';
import { api } from '../../../lib/utils/api';
import ModalComponent from './Conge';
import { FaRegCalendarAlt } from 'react-icons/fa';

const CongeList = () => {
  const [conges, setConges] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchConges = async () => {
    setLoading(true);
    try {
      const response = await api('conges', 'GET');
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

  useEffect(() => {
    fetchConges();
  }, []);

  const handleUpdateSuccess = () => {
    fetchConges();
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box maxW="4xl" mx="auto" p={6} borderWidth={1} borderRadius="md" boxShadow="lg" bg="gray.50">
      <Heading as="h2" size="lg" mb={6} textAlign="center" color="#CE0033">
        Liste des Demandes de Congé
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {conges.length > 0 ? (
          conges.map((conge) => (
            <Box
              key={conge.id}
              p={5}
              borderWidth={1}
              borderRadius="lg"
              boxShadow="md"
              bg="white"
              transition="all 0.3s"
              _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
            >
              <Stack spacing={3}>
                <Flex alignItems="center">
                  <Icon as={FaRegCalendarAlt} boxSize={5} color="#CE0033" mr={2} />
                  <Text fontSize="lg" fontWeight="bold">
                    {conge.type}
                  </Text>
                </Flex>
                <Box justifyContent="space-between" alignItems="center">
                  <Text>
                    <strong>Date début :</strong> {conge.date_debut}
                  </Text>
                  <Text>
                    <strong>Date fin :</strong> {conge.date_fin || 'Non définie'}
                  </Text>
                </Box>
                <Text>
                  <strong>Motif :</strong> {conge.motif || 'Aucun'}
                </Text>
                <Flex alignItems="center" justifyContent="space-between">
                  <Badge
                    colorScheme={
                      conge.status === 'approuvée' ? 'green' : conge.status === 'rejetée' ? 'red' : 'yellow'
                    }
                    p={2}
                    borderRadius="full"
                    textTransform="capitalize"
                  >
                    {conge.status}
                  </Badge>
                  <ModalComponent congeId={conge.id} onUpdateSuccess={handleUpdateSuccess} />
                </Flex>
              </Stack>
            </Box>
          ))
        ) : (
          <Text>Aucun congé trouvé.</Text>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default CongeList;
