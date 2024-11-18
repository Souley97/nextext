import React from 'react';
import {  Box, Text, Flex, VStack } from '@chakra-ui/react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');

const DaysOfWeek = ({ daysOfWeek, setSelectedDay, retard, absent }) => {
  return (
    <VStack         fontFamily="Nunito Sans"
    spacing={0}>
      {daysOfWeek.map((day) => (
        <Flex
          key={dayjs(day).format('dddd, DD/MM ')} // Utilisation du jour comme clé unique
          justify="space-between"
          align="center"
          w="100%"
          p={4}
          borderWidth={1}
          borderRadius="md"
          bg="white"
          onClick={() => setSelectedDay(day)} // Mettez à jour l'état ici
          cursor="pointer"
        >
          <Box >
            <Text fontSize="md" fontWeight="Bold" color="black">
              {dayjs(day).format('dddd')} {/* Format du jour affiché */}
            </Text>
            <Text fontSize="md" fontWeight="normal" color="black">
              {dayjs(day).format('DD/MM')} {/* Format du jour affiché */}
            </Text>
          </Box>

          <Flex gap={3} w="36" align="center">
            <Text flex="1" fontSize="base" fontWeight="medium" color="black">
              {retard} Retard {/* Affichage du nombre de retards */}
            </Text>
            <Text fontSize="base" fontWeight="medium" color="black">
              {absent} Absent {/* Affichage du nombre d'absents */}
            </Text>
          </Flex>
        </Flex>
      ))}
    </VStack>
  );
};

export default DaysOfWeek;
