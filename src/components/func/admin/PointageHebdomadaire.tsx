/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Alert,
  AlertIcon,
  Spinner,
  Heading,
  Text,
  Select,

  HStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { format, eachDayOfInterval, parseISO, isWeekend } from 'date-fns';
import { api } from '../../../lib/utils/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Pointages = () => {
  const [promoId, setPromoId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [promos, setPromos] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const responses = await api('promos', 'GET');
        if (responses) {
          setPromos(responses);
        } else {
          setError('Impossible de récupérer les promotions');
        }
      } catch (error) {
        setError('Erreur lors de la récupération des promotions');
      }
    };

    fetchPromos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation des dates
    if (new Date(startDate) > new Date(endDate)) {
      setError('La date de fin doit être postérieure à la date de début.');
      setLoading(false);
      return;
    }

    try {
      const response = await api('pointages/periode', 'POST', {
        promo_id: promoId,
        start_date: startDate,
        end_date: endDate,
      });
      console.log(response);
      setResult(response.pointages);
    } catch (error) {
      setError(error.response?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };
  const handleExportPDF = () => {
    if (window.confirm('Voulez-vous vraiment exporter ces données en PDF ?')) {
      const input = document.getElementById('attendance-table');
      if (!input) {
        alert("Erreur : l'élément à exporter n'a pas été trouvé.");
        return;
      }

      html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();

          // Calculate image width and height to fit into the PDF
          const imgWidth = pdfWidth;
          const imgHeight = (canvas.height * pdfWidth) / canvas.width;

          // Check if the content height is larger than the PDF height to add pages if necessary
          let position = 0;
          while (position < imgHeight) {
            pdf.addImage(
              imgData,
              'PNG',
              0,
              position > 0 ? 3 : 0, // Adjust for margin on the first page
              imgWidth,
              imgHeight > pdfHeight ? pdfHeight : imgHeight
            );
            position += pdfHeight;
            if (position < imgHeight) {
              pdf.addPage();
            }
          }

          pdf.save('pointages.pdf');
        })
        .catch((error) => {
          console.error('Erreur lors de la génération du PDF :', error);
          alert('Une erreur est survenue lors de la génération du PDF.');
        });
    }
  };

  const getDaysInRange = () => {
    if (!startDate || !endDate) return [];
    try {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      return eachDayOfInterval({ start, end })
        .filter((date) => !isWeekend(date))
        .map((date) => format(date, 'yyyy-MM-dd'));
    } catch (error) {
      return [];
    }
  };

  const days = getDaysInRange();



  const getUniqueDaysWithPointages = (): string[] => {
    if (!result) return [];
    const uniqueDays = new Set<string>(); // Explicitly declare the Set as a Set of strings
    result.forEach((user) => {
      Object.keys(user.dates).forEach((day) => {
        uniqueDays.add(day);
      });
    });
    return Array.from(uniqueDays);
  };

  const uniqueDays = getUniqueDaysWithPointages();

  return (
    <Box p={5}>
      <Heading as="h1" mb={6}>
        Pointage par Période
      </Heading>
      <form onSubmit={handleSubmit}>
        <HStack>
          <SimpleGrid
            overflow="hidden"
            columns={[2, 4]}
            spacingX={6}
            px={1}
            py={2}
            w="full"
            borderRadius="md"
            mt={{ base: 2.5, md: 0 }}
          >
            <FormControl mb={4}>
              <FormLabel>Choisir la promo</FormLabel>
              <Select
                placeholder="Sélectionnez une promotion"
                value={promoId}
                onChange={(e) => setPromoId(e.target.value)}
              >
                {promos.length > 0 ? (
                  promos.map((promo) => (
                    <option key={promo.id} value={promo.id}>
                      {promo.nom}
                    </option>
                  ))
                ) : (
                  <option disabled>Aucune promotion disponible</option>
                )}
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Date de début:</FormLabel>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Date de fin:</FormLabel>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </FormControl>
            <FormControl mt={8}>
              <Button
                type="submit"
                isLoading={loading}
                _hover={{ bg: '#110033' }}
                color="white"
                bg="#CE0033"
              >
                Obtenir Pointages
              </Button>
            </FormControl>
          </SimpleGrid>
        </HStack>
      </form>

      {loading && (
        <Box textAlign="center" mt={4}>
          <Spinner size="xl" />
          <Text mt={2}>Chargement des données...</Text>
        </Box>
      )}

      {error && (
        <Alert status="error" mt={4} aria-live="assertive">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {result && (
        <Box mt={5} overflowX="auto" id="attendance-table">
          <Heading as="h2" size="lg" mb={4}>
            Résultats
          </Heading>
          <Button
            onClick={handleExportPDF}
            _hover={{ bg: '#110033' }}
            color="white"
            bg="#CE0033"
            mb={4}
          >
            Exporter en PDF
          </Button>
          <Table variant="simple" size="sm">
            <TableCaption placement="top">
              Liste des pointages par période (sans week-ends)
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Nom</Th>
                <Th>Prénom</Th>
                {uniqueDays.map((day) => (
                  <Th key={day} textAlign="center">
                    {day}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {result.map((user) => (
                <Tr key={user.user.id} onClick={() => handleUserClick(user)}>
                  <Td>{user.user.nom}</Td>
                  <Td>{user.user.prenom}</Td>
                  {uniqueDays.map((day) => {
                    const status = user.dates[day] || 'Absent';
                    return (
                      <Td key={day} textAlign="center">
                        {status === 'Présent' ? (
                          <Box
                            bg="green.400"
                            color="white"
                            p={1}
                            borderRadius="md"
                          >
                            P
                          </Box>
                        ) : status === 'Retard' ? (
                          <Box
                            bg="orange.400"
                            color="white"
                            p={1}
                            borderRadius="md"
                          >
                            R
                          </Box>
                        ) : (
                          <Box
                            bg="red.400"
                            color="white"
                            p={1}
                            borderRadius="md"
                          >
                            A
                          </Box>
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              ))}
            </Tbody>
            {selectedUser && (
              <Box mt={5}>
                <Text w="100%">
                  {selectedUser.user.nom} {selectedUser.user.prenom} a{' '}
                  {selectedUser.absences} absences et {selectedUser.tardies}{' '}
                  retards.
                </Text>
              </Box>
            )}
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default Pointages;
