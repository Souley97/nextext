'use client';

import React, { useState, Suspense } from 'react';
import { VStack, Spinner, Center, Box, SimpleGrid } from '@chakra-ui/react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import useSWR from 'swr';
import PointageBox from '../../components/common/PointageSection';
import ProfileCardApprenant from '../../components/layout/apprenant/Navbar';
import ProfileComponent from '../../components/func/apprenant/profile';
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
  const attendanceSummaryUrl = `${
    process.env.NEXT_PUBLIC_API_URL
  }/pointages/moi/apprenant?mois=${date.format('MM')}&annee=${date.year()}`;

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
    <ProfileCardApprenant />
    <SimpleGrid justifyContent="space-between" columns={[1, 2]} spacing={4} px={32}>
    
          <Box
            as="section"
            px={20}
            py={8}
            mt={7}
            mx={20}
            w="full"
            maxW={{ base: '366px', md: '500px', lg: '100%' }}
            borderBottom="2px solid"
            borderTop="2px solid"
            borderColor="red.700"
            borderRadius="md"
            shadow="lg"
            bg="whiteAlpha.80"
            fontFamily="Nunito Sans"
            flex="2"
          >
            <Suspense fallback={<Spinner />}>
              <ProfileComponent />
            </Suspense>
          </Box>
          <Box
            as="section"
            px={7}
            py={8}
            mt={7}
            mx={32}
            w="full"
            maxW={{ base: '366px', md: '500px', lg: '70%' }}
            borderBottom="2px solid"
            borderTop="2px solid"
            borderColor="red.700"
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
