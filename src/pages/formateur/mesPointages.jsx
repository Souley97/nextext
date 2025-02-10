'use client';

import React, { useState, lazy, Suspense } from 'react';
import {
  VStack,
  Center,
  Box,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import useSWR from 'swr';
import PointageBox from '../../components/common/PointageSection';
import CardBox from '../../components/common/Card';

// Import du composant `grid` de `ldrs`

import { grid } from 'ldrs'

grid.register()

// Default values shown

// Extensions de Day.js
dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);

// Importation dynamique des composants
const ProfileCardFormateur = lazy(() =>
  import('../../components/layout/formateur/Navbar')
);
const CongeForm = lazy(() => import('../../components/func/formateur/CongeForm'));
const CongeList = lazy(() => import('../../components/func/formateur/ListeConges'));

// Fonction fetcher pour SWR
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

  // URLs pour les API
  const pointagesUrl = `${process.env.NEXT_PUBLIC_API_URL}/pointages/moi/apprenant?mois=${date.format('MM')}&annee=${date.year()}&semaine=${selectedWeek}`;
  const attendanceSummaryUrl = `${process.env.NEXT_PUBLIC_API_URL}/pointages/moi`;

  // Appels API avec SWR
  const { data: pointagesData, error: pointagesError } = useSWR(pointagesUrl, fetcher);
  const { data: attendanceData } = useSWR(attendanceSummaryUrl, fetcher);

  // Résumé des présences
  const attendanceSummary = attendanceData
    ? {
        absent: attendanceData.pointages.filter((p) => p.type === 'absence').length,
        retard: attendanceData.pointages.filter((p) => p.type === 'retard').length,
      }
    : { absent: 0, retard: 0 };

  // Indicateur de chargement
  const isLoading = !pointagesData && !pointagesError;

  const handleMonthChange = (direction) => {
    setDate((prev) => prev.add(direction, 'month'));
    setSelectedWeek(date.isoWeek());
  };

  const semainesDuMois = getWeeksOfMonth(date.month() + 1, date.year());

  // Gestion du chargement global avec l-grid
  if (isLoading) {
    return (
      <Center
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bg="rgba(255, 255, 255, 0.9)" // Fond semi-transparent
        zIndex="1000"
      >

<l-grid
  size="60"
  speed="1.5" 
  color="black" 
></l-grid>    </Center>
    );
  }
  return (
    <VStack spacing={4}>
      <Suspense fallback={<l-grid size="60" speed="1.5" color="gray"></l-grid>}>
        <ProfileCardFormateur />
      </Suspense>
      <SimpleGrid columns={[1, 2]} spacing={8} w="full">
        {/* Section des pointages */}
        <CardBox>
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
        {/* Section des congés */}
        <CardBox>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Formulaire de congé
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Suspense fallback={<l-grid size="30" speed="1" color="blue"></l-grid>}>
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
                <Suspense fallback={<l-grid size="30" speed="1" color="blue"></l-grid>}>
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

// Fonction pour récupérer les semaines d'un mois
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
