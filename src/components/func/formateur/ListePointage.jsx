import { Box, Heading, List } from '@chakra-ui/react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import AttendanceItem from '../../common/AttendanceItem';

// Configure daylayoutjs pour utiliser le français
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
        color="#CE0033"
        mb={8}
        fontFamily="Nunito Sans"
      >
        {/* {`Aujourd'hui `} */}
      </Heading>

      <List
        spacing={4}
        bg="whiteAlpha.80"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="xl"
        boxShadow="sm"
        size="bold"
        fonntWidget="bold"
        fontFamily="Nunito Sans "
      >
        {pointages.map((pointage) => (
          <AttendanceItem
            key={pointage.id}
            name={pointage.name}
            date={dayjs(pointage.date).format('dddd, DD/MM')}
            status={pointage.type}
            time={pointage.heure_present || pointage.type}
            heure_depart={pointage.heure_depart}
            pointageId={pointage.id} // Ajoutez l'ID du pointage
          />
        ))}
      </List>
    </Box>
  );
}

export default ListePointage;
