import { Box, Text, Spinner } from '@chakra-ui/react';

const DailyAttendance = ({ selectedDay, dailyData }) => (
  <Box mt={4}>
    <Text fontSize="lg" fontWeight="bold">Pointages pour {selectedDay.format('dddd, D MMMM YYYY')} :</Text>
    {dailyData ? (
      <Text>{JSON.stringify(dailyData.pointages)}</Text> // Remplacer par votre logique d'affichage
    ) : (
      <Spinner />
    )}
  </Box>
);
export default DailyAttendance ;
