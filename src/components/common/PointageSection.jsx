import { Box, Center, Spinner, Text, VStack } from '@chakra-ui/react'; 
import { Suspense } from 'react'; 
import ListePointage from '../func/formateur/ListePointage'; 
import AttendanceSummary from './AttendanceSummary'; 
import MonthPagination from './MonthPagination'; 
import WeekSelector from './WeekSelector';

const PointageBox = ({
  date,
  handleMonthChange,
  semainesDuMois,
  selectedWeek,
  setSelectedWeek,
  setDate,
  pointagesData,
  pointagesError,
  attendanceSummary,
}) => {
  const handleDateSelect = (newDate) => {
    setDate(newDate);
    setSelectedWeek(newDate.isoWeek());
  };

  return (
    <Box 
      as="section" 
      display="flex" 
      flexDirection="column"
      w="full" 
      maxW={{ base: '100%', md: '100%', lg: '100%' }}
    >
      <Suspense fallback={<Spinner />}>
        <MonthPagination
          mois={date.format('MM')}
          annee={date.year()}
          handlePreviousMonth={() => handleMonthChange(-1)}
          handleNextMonth={() => handleMonthChange(1)}
          onDateSelect={handleDateSelect}
        />
      </Suspense>

      <Suspense>
        <WeekSelector
          semainesDuMois={semainesDuMois}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
        />
      </Suspense>

      {pointagesError ? (
        <Center mt={4}>
          <VStack>
            <Text fontSize="lg" color="gray.600">
              Aucun pointage trouvé pour cette période.
            </Text>
            <AttendanceSummary summary={attendanceSummary} />
          </VStack>
        </Center>
      ) : pointagesData?.pointages.length === 0 ? (
        <Center mt={4}>
          <VStack>
            <Text fontSize="lg" color="gray.600">
              Aucun pointage trouvé pour cette période.
            </Text>
            <AttendanceSummary summary={attendanceSummary} />
          </VStack>
        </Center>
      ) : (
        <>
          {pointagesData?.pointages && (
            <ListePointage pointages={pointagesData.pointages} />
          )}
          <AttendanceSummary summary={attendanceSummary} />
        </>
      )}
    </Box>
  );
};

export default PointageBox;