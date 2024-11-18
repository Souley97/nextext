'use client';

import { Box, Center, SimpleGrid, Spinner, VStack } from '@chakra-ui/react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import { Suspense, useState } from 'react';
import useSWR from 'swr';
import PointageBox from '../../components/common/PointageSection';
import ProfileComponent from '../../components/common/profile';
import ProfileCardApprenant from '../../components/layout/apprenant/Navbar';
// import stylecss globals.css

dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);

// Dynamic component imports

// Fetch function
const fetcher = (url) =>
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Erreur lors de la récupération des données');
    return res.json();
  });

const MesPointages = () => {
  const [date, setDate] = useState(dayjs());
  const [selectedWeek, setSelectedWeek] = useState(date.isoWeek());

  const pointagesUrl = `${
    process.env.NEXT_PUBLIC_API_URL
  }/pointages/moi/apprenant?mois=${date.format(
    'MM'
  )}&annee=${date.year()}&semaine=${selectedWeek}`;
  const attendanceSummaryUrl = `${process.env.NEXT_PUBLIC_API_URL}/pointages/moi`;

  const { data: pointagesData, error: pointagesError } = useSWR(
    pointagesUrl,
    fetcher
  );
  const { data: attendanceData } = useSWR(attendanceSummaryUrl, fetcher);

  const attendanceSummary = attendanceData
    ? {
        absent: attendanceData.pointages.filter((p) => p.type === 'absence')
          .length,
        retard: attendanceData.pointages.filter((p) => p.type === 'retard')
          .length,
      }
    : { absent: 0, retard: 0 };

  const loading = !pointagesData && !pointagesError;

  const handleMonthChange = (direction) => {
    setDate((prev) => prev.add(direction, 'month'));
    setSelectedWeek(date.isoWeek());
  };

  const semainesDuMois = getWeeksOfMonth(date.month() + 1, date.year());

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <VStack spacing={4} maxW="100%">
      <Suspense fallback={<Spinner />}>
        <ProfileCardApprenant />
      </Suspense>

      <SimpleGrid
        mx={{ base: '2px', md: '3px', lg: '12px' }}
        justifyContent="space-between"
        columns={[1, 2]}
        spacing={8}
      >
        <Box
          as="section"
          px={{ base: '2px', md: '3px', lg: '20px' }}
          mx={{ base: '2px', md: '3px', lg: '10px' }}
          py={8}
          mt={7}
          w="full"
          maxW={{ base: '366px', md: '100%', lg: '100%' }}
          borderBottom="2px solid"
          borderTop="2px solid"
          borderColor="#CE0033"
          borderRadius="md"
          shadow="lg"
          bg="whiteAlpha.80"
          fontFamily="Nunito Sans"
          flex="2"
          display={{ base: 'none', md: 'none', lg: 'block' }}
        >
          <Suspense fallback={<Spinner />}>
            <ProfileComponent />
          </Suspense>
        </Box>
        <Box
          as="section"
          px={{ base: '12px', md: '13px', lg: '40px' }}
          mx={{ base: '2px', md: '3px', lg: '100px' }}
          maxW={{ base: '366px', md: '100%', lg: '90%' }}
          py={8}
          mt={7}
          w="full"
          borderBottom="2px solid"
          borderTop="2px solid"
          borderColor="red.100"
          borderRadius="md"
          shadow="lg"
          bg="whiteAlpha.80"
          fontFamily="Nunito Sans"
          flex="2"
        >
          <PointageBox
            date={date}
            handleMonthChange={handleMonthChange}
            semainesDuMois={semainesDuMois}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
            pointagesData={pointagesData}
            pointagesError={pointagesError}
            attendanceSummary={attendanceSummary}
          />
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

const getWeeksOfMonth = (mois, annee) => {
  const startOfMonth = dayjs(`${annee}-${mois}-01`);
  const endOfMonth = startOfMonth.endOf('month');
  const weeks = [];
  let currentWeek = startOfMonth.startOf('week');

  while (currentWeek.isBefore(endOfMonth, 'week')) {
    weeks.push({
      start: currentWeek.format('YYYY-MM-DD'),
      end: currentWeek.endOf('week').format('YYYY-MM-DD'),
      number: currentWeek.isoWeek(),
    });
    currentWeek = currentWeek.add(1, 'week');
  }

  return weeks;
};

export default MesPointages;
