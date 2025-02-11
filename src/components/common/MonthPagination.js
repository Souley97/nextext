import { Button, HStack, Input, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useState } from 'react';

const MonthPagination = ({ mois, annee, handlePreviousMonth, handleNextMonth, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const buttonBg = useColorModeValue('#ce0033', '#ce0033');
  
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    if (onDateSelect) {
      onDateSelect(dayjs(newDate));
    }
  };

  return (
  
    <HStack spacing={4} mx={4} fontWeight="bold" justifyContent="space-between" my={7}>
      
    
      <Button 
        onClick={handlePreviousMonth} 
        shadow="lg" 
        color="white" 
        bg={buttonBg}
        _hover={{ bg: '#a30028' }}
      >
        {'<'}
      </Button>

      <VStack spacing={2} >
      <Input
    type="date"
    value={selectedDate}
    onChange={handleDateChange}
    size="sm"
    w={32}
    borderColor={buttonBg}
    _hover={{ borderColor: '#a30028' }}
  />
  <Text fontSize="lg" fontWeight="bold">
    {dayjs(`${annee}-${mois}-01`).format('MMMM YYYY')}
  </Text>
  
  
  
  
</VStack>

      <Button 
        onClick={handleNextMonth} 
        shadow="lg" 
        color="white" 
        bg={buttonBg}
        _hover={{ bg: '#a30028' }}
      >
        {'>'}
      </Button>
    </HStack>
  );
};

export default MonthPagination;