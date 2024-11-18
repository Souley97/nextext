import { Button, HStack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';

const MonthPagination = ({ mois, annee, handlePreviousMonth, handleNextMonth }) => {
  return (
    <HStack spacing={1} mx={2}  justifyContent="space-between" mb={6}>
      <Button onClick={handlePreviousMonth}  shadow="lg" bg={'#ce0033'}>{'<'}</Button>
      <Text  fontSize="lg" fontWeight="bold" color="">
        {dayjs(`${annee}-${mois}-01`).format('MMMM YYYY')}
      </Text>
      <Button onClick={handleNextMonth}  shadow="lg" bg={'#ce0033'}>{'>'}</Button>
    </HStack>
  );
};

export default MonthPagination;
