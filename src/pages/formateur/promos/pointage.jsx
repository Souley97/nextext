'use client';

import { Center, HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import { lazy, Suspense, useEffect, useState } from 'react';
import useSWR from 'swr';
import ListePointage from '../../../components/formateur/ListePointage';
import PointageBoxPromo from '../../../components/formateur/MesPointages';

dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);

// Dynamic component imports
const ProfileCardFormateur = lazy(() =>
  import('../../../components/layout/formateur/Navbar')
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

const MesPointagesP7 = () => {
  const [date, setDate] = useState(dayjs());
  const [selectedWeek, setSelectedWeek] = useState(date.isoWeek());
  const [selectedDay, setSelectedDay] = useState(null); // Selected day state
  const promoId = 3;

  // URLs for fetching data
  const pointagesUrl = `${
    process.env.NEXT_PUBLIC_API_URL
  }/pointages/promo?promo_id=${promoId}&mois=${date.format(
    'MM'
  )}&annee=${date.year()}&semaine=${selectedWeek}`;
  const dailyAttendanceUrl = (day) =>
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/pointages/promo?promo_id=${promoId}&date=${day.format('YYYY-MM-DD')}`;

  const { data: pointagesData, error: pointagesError } = useSWR(
    pointagesUrl,
    fetcher
  );
  const { data: dailyData } = useSWR(
    selectedDay ? dailyAttendanceUrl(selectedDay) : null,
    fetcher
  );

  const attendanceSummary = pointagesData
    ? {
        absent: pointagesData.pointages.filter((p) => p.type === 'absence')
          .length,
        retard: pointagesData.pointages.filter((p) => p.type === 'retard')
          .length,
      }
    : { absent: 0, retard: 0 };

  const loading = !pointagesData && !pointagesError;

  const handleMonthChange = (direction) => {
    setDate((prev) => prev.add(direction, 'month'));
    setSelectedWeek(date.isoWeek());
  };

  const semainesDuMois = getWeeksOfMonth(date.month() + 1, date.year());

  useEffect(() => {
    setSelectedWeek(date.isoWeek());
  }, [date]);

  useEffect(() => {
    console.log('API URL:', pointagesUrl);
    console.log(
      'Selected Day API URL:',
      selectedDay ? dailyAttendanceUrl(selectedDay) : null
    );
    console.log('Pointages Data:', pointagesData);
    console.log('Daily Data:', dailyData);
  }, [pointagesUrl, selectedDay, pointagesData, dailyData]);

  // Calcul des jours de la semaine
  const daysOfWeek = getDaysOfWeek(selectedWeek, date.year());

  // Gérer le chargement global
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
        <ProfileCardFormateur />
      </Suspense>

      <HStack justifyContent="space-between" w="100%">
        {/* Rendu conditionnel basé sur selectedDay et l'état des données */}
        <Suspense fallback={<Spinner />}>
          {dailyData ? (
            dailyData.pointages.length > 0 ? (
              <ListePointage
                pointages={dailyData.pointages}
                promo={undefined}
              />
            ) : (
              <Text>Aucun pointage trouvé pour la journée sélectionnée.</Text>
            )
          ) : (
            <Text>Chargement des données...</Text>
          )}
        </Suspense>

        <PointageBoxPromo
          date={date}
          handleMonthChange={handleMonthChange}
          semainesDuMois={semainesDuMois}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          pointagesData={pointagesData}
          pointagesError={pointagesError}
          attendanceSummary={attendanceSummary}
          setSelectedDay={setSelectedDay} // Passez setSelectedDay
          daysOfWeek={daysOfWeek}
          dailyData={dailyData} // Données filtrées par jour
        />
      </HStack>
    </VStack>
  );
};

// Helper functions to get weeks and days of the week
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

const getDaysOfWeek = (week, year) => {
  const startOfWeek = dayjs().isoWeek(week).year(year).startOf('isoWeek');
  return Array.from({ length: 5 }, (_, index) => startOfWeek.add(index, 'day')); // Limité à 5 jours pour la semaine
};

export default MesPointagesP7;
