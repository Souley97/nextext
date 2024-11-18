import { Button, HStack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';

const MonthPagination = ({ mois, annee, handlePreviousMonth, handleNextMonth }) => {
  return (
    <HStack spacing={1} mx={4} fontWeight="bold" justifyContent="space-between" my={7}>
      <Button onClick={handlePreviousMonth}  shadow="lg" color="white" bg={'#ce0033'}>{'<'}</Button>
      <Text fontSize="lg" fontWeight="bold" >
        {dayjs(`${annee}-${mois}-01`).format('MMMM YYYY')}
      </Text>
      <Button onClick={handleNextMonth} fontWeight="bold" color="white" shadow="lg" bg={'#ce0033'}>{'>'}</Button>
    </HStack>
  );
};

export default MonthPagination;
