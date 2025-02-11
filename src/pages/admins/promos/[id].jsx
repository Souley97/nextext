// eslint-disable-next-line no-unused-vars
'use client';

import {
  Box,
  SimpleGrid,
  Spinner,
  Text,
  Image,
  VStack,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import { useRouter } from 'next/router';
import { lazy, Suspense, useEffect, useState } from 'react';
import useSWR from 'swr';
// import ListePointage from '../../../components/func/formateur/ListePointage';
// import PointageBoxPromo   from '../../../components/func/formateur/MesPointages';
import CardBox from '../../../components/common/Card';
import ListePointage from '../../../components/func/admin/ListePointage';
import PointageBoxPromo from '../../../components/func/admin/MesPointages';

dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);

// Dynamic component imports
const ProfileCardAdministrateur = lazy(() =>
  import('../../../components/layout/admin/Navbar')
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

const PointagesPromo = () => {
  const [date, setDate] = useState(dayjs());
  const [selectedWeek, setSelectedWeek] = useState(date.isoWeek());
  
  const [selectedDay, setSelectedDay] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [promo, setPromo] = useState(null);
  const router = useRouter();
  const { id: promoId } = router.query;

  const pointagesUrl = `${
    process.env.NEXT_PUBLIC_API_URL
  }/pointages/promo?promo_id=${promoId}&mois=${date.format('MM')}&annee=${date.year()}&semaine=${selectedWeek}`;
  
  const dailyAttendanceUrl = (day) =>
    `${process.env.NEXT_PUBLIC_API_URL}/pointages/promo/all?promo_id=${promoId}&date=${day.format('YYYY-MM-DD')}`;
  
  const promoUrl = `${process.env.NEXT_PUBLIC_API_URL}/promos/${promoId}`;

  const { data: pointagesData, error: pointagesError } = useSWR(pointagesUrl, fetcher);
  const {
    data: dailyData,
    error: dailyError,
    isLoading: isDailyLoading,
  } = useSWR(selectedDay ? dailyAttendanceUrl(selectedDay) : null, fetcher);

  // const attendanceSummary = dailyData?.pointages
  //   ? {
  //       absent: dailyData.pointages.filter((p) => p.type === 'absence').length,
  //       retard: dailyData.pointages.filter((p) => p.type === 'retard').length,
  //     }
  //   : { absent: 0, retard: 0 };

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
    const fetchPromoData = async () => {
      try {
        const response = await fetch(promoUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const promoData = await response.json();
        setPromo(promoData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données de la promo:', error);
      }
    };
    fetchPromoData();
  }, [promoId]);

  useEffect(() => {
    console.log('API URL:', pointagesUrl);
    console.log('Selected Day API URL:', selectedDay ? dailyAttendanceUrl(selectedDay) : null);
    console.log('Pointages Data:', pointagesData);
    console.log('Daily Data:', dailyData);
  }, [pointagesUrl, selectedDay, pointagesData, dailyData]);

  const daysOfWeek = getDaysOfWeek(selectedWeek, date.year());



  return (
    <VStack maxW="100%">
      <Suspense fallback={<Spinner />}>
        <ProfileCardAdministrateur />
      </Suspense>

      <SimpleGrid spacingX={24} mr={{ base: '0', md: '0', lg: '150px' }} columns={[1, 2]}>
        <CardBox
          px={{ base: '12px', md: '13px', lg: '10px' }}
          mx={{ base: '2px', md: '3px', lg: '10px' }}
          maxW={{ base: '366px', md: '100%', lg: '100%' }}
        >
          <Suspense fallback={<Spinner />}>
            <Text fontWeight="bold" fontSize={20} textAlign="center">
              Promo: {promoId}
            </Text>

            <Box display="flex" justifyContent="space-around" mt={4}>
              <StatusCard
                src="/images/presence.png"
                alt="Status: present"
                label="Présents"
                // count={dailyData?.pointages.filter((p) => p.type === 'present').length || 0}
              />
              <StatusCard
                src="/images/retard.png"
                alt="Status: retard"
                label="Retards"
                  // count={attendanceSummary.retard}
              />
              <StatusCard
                src="/images/absent.png"
                alt="Status: absent"
                label="Absents"
                // count={attendanceSummary.absent}
              />
            </Box>

            {isDailyLoading ? (
              <Spinner />
            ) : dailyError ? (
              <Text>Erreur lors de la récupération des données.</Text>
            ) : dailyData?.apprenants_avec_pointage?.length > 0 ||
              dailyData?.apprenants_sans_pointage?.length > 0 ? (
              <>
                {dailyData.apprenants_avec_pointage.length > 0 && (
                  <Box>
                    <ListePointage pointages={dailyData.apprenants_avec_pointage} />
                  </Box>
                )}
                {dailyData.apprenants_avec_pointage.length === 0 && (
                  <Box mt="20" textAlign="center">
                    <Text>Aucun pointage trouvé pour la journée sélectionnée.</Text>
                  </Box>
                )}
              </>
            ) : (
              <>
                <Text>
                  Date: {selectedDay ? selectedDay.format('DD/MM/YYYY') : 'Date non sélectionnée'}
                </Text>
                <Text mt="20" textAlign="center">Aucun pointage trouvé pour la journée sélectionnée.</Text>
              </>
            )}
          </Suspense>
        </CardBox>

        <CardBox maxW={{ base: '366px', md: '100%', lg: '90%' }}>
          <PointageBoxPromo
            date={date}
            handleMonthChange={handleMonthChange}
            semainesDuMois={semainesDuMois}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
            pointagesData={pointagesData}
            pointagesError={pointagesError}
            // attendanceSummary={attendanceSummary}
            setSelectedDay={setSelectedDay}
            daysOfWeek={daysOfWeek}
            dailyData={dailyData}
          />
        </CardBox>
      </SimpleGrid>
    </VStack>
  );
};

// StatusCard component to display attendance status
const StatusCard = ({ src, alt, label, count }) => (
  <VStack>
    <Image
      src={src}
      alt={alt}
      loading="lazy"
      objectFit="contain"
      w="24px"
      h="24px"
      flexShrink={0}
    />
    <Text fontWeight="bold">{label}</Text>
    <Text>{count}</Text>
  </VStack>
);

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
  return Array.from({ length: 5 }, (_, index) => startOfWeek.add(index, 'day'));
};

export default PointagesPromo;