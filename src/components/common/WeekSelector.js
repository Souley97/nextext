import { Button, HStack, Icon, Text } from '@chakra-ui/react';
import { FaCalendarAlt } from 'react-icons/fa';

import { useColorMode } from '@chakra-ui/react'; // Import du hook


const WeekSelector = ({ semainesDuMois, selectedWeek, setSelectedWeek }) => {

  const { colorMode } = useColorMode(); // Utilise le hook pour détecter le mode
  const isDarkMode = colorMode === 'dark'; // Vérifie si le mode sombre est activé

  return (
    <HStack justify="center">
      {semainesDuMois.map((week) => (
        <Button
          display="block"
          w="20%"
          height="full"
          py={2}
          key={week.number}
          onClick={() => setSelectedWeek(week.number)}
          // Gestion des couleurs en fonction du mode
          bg={selectedWeek === week.number ? '#CE0033' : isDarkMode ? 'gray.700' : 'gray.700'}
          border="none"
          borderRadius="lg"
          shadow="md"
          _focus={{ outline: 'none' }}
          _hover={{
            bg: '#CE0033',
            color: 'white',
          }}
          _active={{
            bg: '#CE0033',
            color: 'white',
          }}
          lineHeight="1"
          transition="all 0.3s ease-in-out"
          _text={{
            color: selectedWeek === week.number ? 'white' : isDarkMode ? 'gray.600' : 'gray.800',
          }}
          _disabledText={{ color: 'gray.300' }}
          _icon
          color={selectedWeek === week.number ? 'white' : isDarkMode ? 'gray.400' : 'gray.400'}
        >
          <Icon size="xl" as={FaCalendarAlt} />
          <Text as="h5" w={12}fontSize={{base: '11px' , md : '11px', lg: '16px'}}  mr={{base: '4px' , md : '4px', }} >Semaine {week.number}</Text>

        </Button>
      ))}
    </HStack>
  );
};

export default WeekSelector;
