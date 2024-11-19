/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Center,
  Flex,
  SimpleGrid,
  Heading,
  Select,
  Skeleton,
  Text,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { api } from '../../lib/utils/api';
import { useUserWithRoles } from '../../lib/utils/hooks/useUserWithRoles';
import ProfileCardAdministrateur from '../../components/layout/formateur/Navbar';

const MotionBox = motion(Box);

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const AdminPage = () => {
  useUserWithRoles(['Formateur']);
  const [promoId, setPromoId] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [dateDebut, setDateDebut] = useState('2024-01-10');
  const [dateFin, setDateFin] = useState('2024-12-10');
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await api('promos/formateur', 'GET');
        console.log('Promotions Response:', response); // Vérification de la réponse API
        setPromotions(response.data); // Utilisez response.data pour accéder au tableau des promotions
      } catch (error) {
        console.error(error.message);
        setError(error.message);
      }
    };

    fetchPromotions();
  }, []);

  const fetchData = useCallback(async () => {
    if (!promoId) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/promos/static`, {
        // const response = await fetch(`https://simplon-pointe.julinhondiaye097.simplonfabriques.com/api/promos/static`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promo_id: promoId,
          date_debut: dateDebut,
          date_fin: dateFin,
        }),
      });

      if (!response.ok)
        throw new Error('Erreur lors du chargement des statistiques');

      const result = await response.json();

      if (result.success) {
        const weeklyChartData = Object.entries(result.statistiques_semaine).map(
          ([week, stats]) => ({
            name: `Semaine ${week} (${stats.date_debut} - ${stats.date_fin})`,
            absences: stats.absences,
            retards: stats.retards,
          })
        );

        const monthlyChartData = Object.entries(result.statistiques_mois).map(
          ([month, stats]) => ({
            name: month,
            absences: stats.absences,
            retards: stats.retards,
          })
        );

        setWeeklyData(weeklyChartData);
        setMonthlyData(monthlyChartData);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [promoId, dateDebut, dateFin]);

  useEffect(() => {
    const debouncedFetch = debounce(fetchData, 500);
    debouncedFetch();
    return () => clearTimeout(debouncedFetch);
  }, [fetchData]);

  if (error) {
    return (
      <Center>
        <Text color="red.500">{error}</Text>
        <Button onClick={() => setError(null)} mt={4}>
          Réessayer
        </Button>
      </Center>
    );
  }

  const totalAbsences = weeklyData.reduce(
    (acc, item) => acc + item.absences,
    0
  );
  const totalDelays = weeklyData.reduce((acc, item) => acc + item.retards, 0);
  const pieData = [
    { name: 'Absences', value: totalAbsences },
    { name: 'Retards', value: totalDelays },
  ];

  const COLORS = ['#ce0033', '#3182ce'];

  return (
    <Center display="block" py={8}>
      <ProfileCardAdministrateur />

      <SimpleGrid
        mx={{ base: '4px', md: '10px', lg: '20px' }}
        columns={[1, null, 3]}
        spacing={10}
      >
        <MotionBox
          as="section"
          p={{ base: 4, md: 8 }}
          pt={{ base: 4, md: 24 }}
          borderRadius="md"
          shadow="md"
          bg="whiteAlpha.90"
          whileHover={{ scale: 1.03 }}
        >
          <Heading as="h2" size="lg" mb={4} textAlign="center">
            Statistiques Hebdomadaires
          </Heading>

          {loading ? (
            <Skeleton height="400px" />
          ) : promoId ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="absences" fill="#ce0033" />
                <Bar dataKey="retards" fill="#3182ce" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Text textAlign="center">Veuillez sélectionner une promotion</Text>
          )}
        </MotionBox>

        <MotionBox
          as="section"
          p={{ base: 4, md: 8 }}
          borderRadius="md"
          shadow="md"
          bg="whiteAlpha.90"
          whileHover={{ scale: 1.03 }}
        >
          <Flex justifyContent="center" mb={6}>
            <Select
              placeholder="Sélectionnez une promotion"
              value={promoId}
              onChange={(e) => setPromoId(e.target.value)}
              width="60%"
            >
              {Array.isArray(promotions) &&
                promotions.map((promo) => (
                  <option key={promo.id} value={promo.id}>
                    {promo.nom}
                  </option>
                ))}
            </Select>
          </Flex>

          <Heading as="h2" size="lg" mb={4} textAlign="center">
            Statistiques Mensuelles
          </Heading>

          {loading ? (
            <Skeleton height="400px" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                width={730}
                height={250}
                data={monthlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="absences"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
                <Area
                  type="monotone"
                  dataKey="retards"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorPv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </MotionBox>

        <MotionBox
          as="section"
          p={{ base: 4, md: 8 }}
          pt={{ base: 4, md: 24 }}
          borderRadius="md"
          shadow="md"
          bg="whiteAlpha.90"
          whileHover={{ scale: 1.03 }}
        >
          <Heading as="h2" size="lg" mb={4} textAlign="center">
            Détails des Statistiques
          </Heading>

          {loading ? (
            <Skeleton height="400px" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart width={730} height={250}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  fill="#8884d8"
                />

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                />

                <Tooltip />
              </PieChart>

              
            </ResponsiveContainer>
          )}
        </MotionBox>
      </SimpleGrid>
    </Center>
  );
};

export default AdminPage;
