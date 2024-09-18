import React from 'react';
import { Box, Heading, List } from '@chakra-ui/react';
import AttendanceItem from './AttendanceItem';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

// Configure dayjs pour utiliser le français
dayjs.locale('fr');
function ListePointage({ pointages }) {
  return (
    <Box
      as="section"
      display="flex"
      flexDirection="column"
      
      bg="whiteAlpha.80"
      fontFamily="Nunito Sans"
    >
      <Heading
        as="h2"
        size={{ base: 'md', md: 'lg' }} // Smaller heading size on mobile, larger on desktop
        textAlign="center"
        color="red.700"
        mb={8}
        fontFamily="Nunito Sans"

      >
        {/* {`Aujourd'hui `} */}
      </Heading>

      <List
        spacing={4}
        bg="white"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="xl"
        boxShadow="sm"
        size="bold" fonntWidget="bold"
        fontFamily="Nunito Sans "
      >
        {pointages.map((pointage) => (
          <AttendanceItem 
          // date comme lundi
          date={dayjs(pointage.date).format('dddd, DD/MM ')}ey={pointage.id}
  
          status={pointage.type} // Assuming `type` is either 'present', 'retard', or 'absent'
          time={pointage.heure_present || pointage.type}
        />
        
        ))}
      </List>
    </Box>
  );
}

export default ListePointage;
