import React, { useMemo } from 'react';
import { Button, HStack, Icon, Text } from '@chakra-ui/react';
import { FaCalendarAlt } from 'react-icons/fa';
import { useColorMode } from '@chakra-ui/react'; // Import du hook

const WeekSelector = ({ semainesDuMois, selectedWeek, setSelectedWeek }) => {
  const { colorMode } = useColorMode(); // Utilise le hook pour détecter le mode
  const isDarkMode = colorMode === 'dark'; // Vérifie si le mode sombre est activé

  // Mémorisation des couleurs pour éviter de recalculer à chaque clic
  const buttonStyles = useMemo(() => ({
    defaultBg: isDarkMode ? 'gray.700' : 'gray.700',
    selectedBg: '#CE0033',
    hoverBg: '#CE0033',
    textColor: isDarkMode ? 'gray.600' : 'gray.800',
    selectedTextColor: 'white',
    selectedIconColor: 'white',
    iconColor: isDarkMode ? 'gray.400' : 'gray.400',
  }), [isDarkMode]);

  return (
    <HStack justify="center" mb={10}>
      {semainesDuMois.map((week) => (
        <Button
          display="block"
          height="full"
          py={3}
          w="full"
          px={{ base: '0px', md: '2px', lg: '22px' }}
          maxW={{ base: '140px', md: '322px', lg: '180px' }}
          key={week.number}
          onClick={() => setSelectedWeek(week.number)}
          // Gestion des couleurs en fonction du mode
          bg={selectedWeek === week.number ? buttonStyles.selectedBg : buttonStyles.defaultBg}
          border="none"
          borderRadius="lg"
          shadow="md"
          _focus={{ outline: 'none' }}
          _hover={{
            bg: buttonStyles.hoverBg,
            color: 'white',
          }}
          _active={{
            bg: buttonStyles.hoverBg,
            color: 'white',
          }}
          lineHeight="1"
          transition="all 0.3s ease-in-out"
          _text={{
            color: selectedWeek === week.number ? buttonStyles.selectedTextColor : buttonStyles.textColor,
          }}
          _disabledText={{ color: 'gray.300' }}
          _icon
          color={selectedWeek === week.number ? buttonStyles.selectedIconColor : buttonStyles.iconColor}
        >
          <Icon size="xl" as={FaCalendarAlt} />
          <Text fontSize={{ base: '12px', md: '12px', lg: '18px' }} ml={{ base: '0', md: '0', lg: '-10px' }}>
            Semaine {week.number}
          </Text>
        </Button>
      ))}
    </HStack>
  );
};

export default React.memo(WeekSelector);
