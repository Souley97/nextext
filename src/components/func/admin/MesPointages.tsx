import React, { Suspense } from 'react';
import MonthPagination from '../../formateur/MonthPagination';
import WeekSelector from '../../formateur/WeekSelector';
import DaysOfWeek from '../../formateur/DaysOfWeek';
// import AttendanceSummary from '../../formateur/AttendanceSummary';
import { Box, Center, Spinner, Text } from '@chakra-ui/react';

const PointageBoxPromo = ({
  date,
  handleMonthChange,
  semainesDuMois,
  selectedWeek,
  setSelectedWeek,
  pointagesError,
  // attendanceSummary,
  setSelectedDay,
  daysOfWeek,
  dailyData,
}) => (
  <Box
    as="section"
    display="flex"
    px={{ base: '12px', md: '12px', lg: '42px' }}
    flexDirection="column"
    w="full"
   
  >
    <Suspense fallback={<Spinner />}>
      <MonthPagination
        mois={date.format('MM')}
        annee={date.year()}
        handlePreviousMonth={() => handleMonthChange(-1)}
        handleNextMonth={() => handleMonthChange(1)}
      />
    </Suspense>

    <Suspense fallback={<Spinner />}>
      <WeekSelector
        semainesDuMois={semainesDuMois}
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
      />
    </Suspense>

    {pointagesError ? (
      <Center mt={4}>
        <Text fontSize="lg" color="gray.600">
          Erreur lors de la récupération des pointages.
        </Text>
      </Center>
    ) : dailyData && dailyData.pointages && dailyData.pointages.length === 0 ? (
      <Center mt={4}>
        <Text fontSize="lg" color="gray.600">
          Aucun pointage trouvé pour ce jour.
        </Text>
      </Center>
    ) : (
      <>
        <Suspense fallback={<Spinner />}>
          <DaysOfWeek
            daysOfWeek={daysOfWeek}
            setSelectedDay={setSelectedDay}
            retard={undefined}
            absent={undefined}
            
          />
        </Suspense>

        {/* <Suspense fallback={<Spinner />}>
          <AttendanceSummary summary={attendanceSummary} />
        </Suspense> */}
      </>
    )}
  </Box>
);

export default PointageBoxPromo;
