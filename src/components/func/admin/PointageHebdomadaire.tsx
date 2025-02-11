/* eslint-disable no-unused-vars */
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';
import { eachDayOfInterval, format, isWeekend, parseISO } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaDownload, FaSearch } from 'react-icons/fa';
import { api } from '../../../lib/utils/api';

const Pointages = () => {
  const [promoId, setPromoId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [promos, setPromos] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const bgCard = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const headingColor = useColorModeValue('gray.700', 'white');
  const tableBgColor = useColorModeValue('gray.50', 'gray.700');
  const summaryBgAbsence = useColorModeValue('red.50', 'red.900');
  const summaryBgRetard = useColorModeValue('orange.50', 'orange.900');

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
  
      html2canvas(input, {
        scale: 2,
        logging: false,
        useCORS: true,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('l', 'mm', 'a4');
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        const ratio = canvas.width / canvas.height;
        let imgWidth = pageWidth - 20;
        let imgHeight = imgWidth / ratio;
  
        if (imgHeight > pageHeight - 30) {
          imgHeight = pageHeight - 30;
          imgWidth = imgHeight * ratio;
        }
  
        const x = (pageWidth - imgWidth) / 2;
        const y = 20;
  
        pdf.setFontSize(16);
        pdf.text('Rapport de Pointages', pageWidth / 2, 15, { align: 'center' });
        
        pdf.setFontSize(10);
        pdf.text(
          `Généré le ${new Date().toLocaleDateString('fr-FR')}`,
          pageWidth / 2,
          22,
          { align: 'center' }
        );
  
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
  
        const pageCount = pdf.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.text(
            `Page ${i} sur ${pageCount}`,
            pageWidth - 10,
            pageHeight - 10,
            { align: 'right' }
          );
        }
  
        pdf.save(`pointages_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      }).catch((error) => {
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
    const uniqueDays = new Set<string>();
    result.forEach((user) => {
      Object.keys(user.dates).forEach((day) => {
        uniqueDays.add(day);
      });
    });
    return Array.from(uniqueDays);
  };

  const uniqueDays = getUniqueDaysWithPointages();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Heading size="lg" color={headingColor}>
          Gestion des Pointages
        </Heading>

        <Card w="full" bg={bgCard} borderColor={borderColor} shadow="lg">
          <CardHeader>
            <Heading size="md">Sélection de la période</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <Grid 
                templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} 
                gap={6}
              >
                <FormControl>
                  <FormLabel>Promotion</FormLabel>
                  <Select
                    icon={<FaCalendarAlt />}
                    placeholder="Choisir une promotion"
                    value={promoId}
                    onChange={(e) => setPromoId(e.target.value)}
                    borderColor={borderColor}
                    _hover={{ borderColor: 'blue.500' }}
                  >
                    {promos.map((promo) => (
                      <option key={promo.id} value={promo.id}>
                        {promo.nom}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Date de début</FormLabel>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    borderColor={borderColor}
                    _hover={{ borderColor: 'blue.500' }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Date de fin</FormLabel>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    borderColor={borderColor}
                    _hover={{ borderColor: 'blue.500' }}
                  />
                </FormControl>
              </Grid>

              <Flex justify="flex-end" mt={6}>
                <Button
                  leftIcon={<FaSearch />}
                  colorScheme="red"
                  isLoading={loading}
                  type="submit"
                >
                  Rechercher
                </Button>
              </Flex>
            </form>
          </CardBody>
        </Card>

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
          <Card w="full" bg={bgCard} borderColor={borderColor} shadow="lg">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Résultats des pointages</Heading>
                <Button
                  leftIcon={<FaDownload />}
                  colorScheme="red"
                  onClick={handleExportPDF}
                  size="sm"
                >
                  Exporter PDF
                </Button>
              </Flex>
            </CardHeader>
            <CardBody overflowX="auto">
              <Table variant="simple" id="attendance-table">
                <Thead>
                  <Tr bg={tableBgColor}>
                    <Th>Nom</Th>
                    <Th>Prénom</Th>
                    {uniqueDays.map((day) => (
                      <Th key={day} textAlign="center">
                        {format(new Date(day), 'dd/MM')}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {result.map((user) => (
                    <Tr 
                      key={user.user.id} 
                      onClick={() => handleUserClick(user)}
                      _hover={{ bg: hoverBgColor }}
                      cursor="pointer"
                    >
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
              </Table>
            </CardBody>
          </Card>
        )}

        {selectedUser && (
          <Card w="full" bg={bgCard} borderColor={borderColor} shadow="sm">
            <CardBody>
              <Text fontSize="lg" fontWeight="medium">
                Résumé pour {selectedUser.user.nom} {selectedUser.user.prenom}
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
                <Box p={4} bg={summaryBgAbsence} borderRadius="md">
                  <Text>Absences: {selectedUser.absences}</Text>
                </Box>
                <Box p={4} bg={summaryBgRetard} borderRadius="md">
                  <Text>Retards: {selectedUser.tardies}</Text>
                </Box>
              </Grid>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Container>
  );
};

export default Pointages;