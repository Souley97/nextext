import { Box, Heading, List } from '@chakra-ui/react';
import AttendanceItem from './AttendanceItem';
import ButtonDeconnexion from '../../common/ButtonDeconnexion';

function ListePointage({ pointages }) {
  return (
    <Box
      as="section"
      display="flex"
      flexDirection="column"
      px={2}
      py={8}
      mt={16}
      mx="auto"
      w="full"
      maxW={{ base: '366px', md: '700px', lg: '900px' }} // Responsive width for mobile, tablet, and desktop
      borderBottom="2px solid"
      borderTop="2px solid"
      borderColor="#CE0033"
      borderRadius="md"
      shadow="lg"
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
        {`Aujourd'hui `}
      </Heading>
      <ButtonDeconnexion />

      <List
        spacing={4}
        bg="white"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="xl"
        boxShadow="sm"
      >
        {pointages.map(
          (pointage) => (
            console.log(pointage),
            (
              <AttendanceItem
                key={pointage.id}
                name={`${pointage.user.prenom} ${pointage.user.nom}`} // Concatenate first and last names
                role={pointage.user.role}
                promos={
                  pointage.user.promos && pointage.user.promos.length > 0
                    ? pointage.user.promos[0].nom
                    : 'Formateur'
                } // Check if promos exist and not empty
                heur_arrive={pointage.heure_present}
                heure_depard={
                  pointage.heure_depart ? pointage.heure_depart : null
                }
                status={pointage.type} // Assuming `type` is either 'present', 'retard', or 'absent'
              />
            )
          )
        )}
      </List>
    </Box>
  );
}

export default ListePointage;
