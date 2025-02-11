import { Box, Text } from '@chakra-ui/react';

const DailyAttendance = ({ selectedDay, dailyData }) => (
  <Box mt={4}>
    <Text fontSize="lg" fontWeight="bold">Pointages pour {selectedDay.format('dddd, D MMMM YYYY')} :</Text>
    {dailyData  (
      <Text>{JSON.stringify(dailyData.pointages)}</Text> // Remplacer par votre logique d'affichage
    ) }
  </Box>
);
export default DailyAttendance ;
