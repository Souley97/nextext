import { Box, Center, Spinner, Text } from '@chakra-ui/react';
import { Suspense } from 'react';
import AttendanceSummary from './AttendanceSummary';
import DaysOfWeek from './DaysOfWeek';
import MonthPagination from './MonthPagination';
import WeekSelector from './WeekSelector';

const PointageBoxPromo = ({
  date,
  handleMonthChange,
  semainesDuMois,
  selectedWeek,
  setSelectedWeek,
  pointagesError,
  attendanceSummary,
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
    maxW={{ base: '366px', md: '500px', lg: '100%' }}
    borderBottom="2px solid"
    borderTop="2px solid"
    borderColor="#CE0033"
    borderRadius="md"
    shadow="lg"
    bg="whiteAlpha.80"
    fontFamily="Nunito Sans"
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
    ) : dailyData && dailyData.pointages.length === 0 ? (
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

        <Suspense fallback={<Spinner />}>
          <AttendanceSummary summary={attendanceSummary} />
        </Suspense>
      </>
    )}
  </Box>
);

export default PointageBoxPromo;
