
'use client';

import React, { useState, lazy, Suspense } from 'react';
import {
  VStack,
  Spinner,
  Center,
  Box,
  SimpleGrid,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon 
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import useSWR from 'swr';
import PointageBox from '../../components/common/PointageSection';
import CongeList from '../../components/func/formateur/ListeConges';
import CongeForm from '../../components/func/formateur/CongeForm';
import CardBox from '../../components/common/Card';

dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);

// Dynamic component imports
const ProfileCardFormateur = lazy(() =>
  import('../../components/layout/formateur/Navbar')
);
  
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
  }/pointages/moi`;

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
    <VStack spacing={2}>
      <Suspense fallback={<Spinner />}>
        <ProfileCardFormateur />
      </Suspense>
      <SimpleGrid
        mr={{ base: '2px', md: '3px', lg: '292px' }}
        justifyContent="space-between"
        columns={[1, 2]}
        spacing={52}
      >
       
        <CardBox
          as="section"
          px={{ base: '2px', md: '30px', lg: '60px' }}
          ml={{ base: '2px', md: '20px', lg: '220px' }}
      
          maxW={{ base: '100%', lg: '100%' }}
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
        </CardBox>
        <CardBox
          as="section"
          px={{ base: '12px', md: '13px', lg: '40px' }}
          mx={{ base: '2px', md: '3px', lg: '80px' }}
          maxW={{ base: '366px', md: '100%', lg: '100%' }}
        
        
        > <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Formulaire de congé
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Suspense fallback={<Spinner />}>
              <CongeForm />
            </Suspense>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Liste des congés
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Suspense fallback={<Spinner />}>
              <CongeList />
            </Suspense>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
        </CardBox>
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
