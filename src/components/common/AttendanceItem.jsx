import { ListItem, Flex, Box, Text, Image, useDisclosure } from '@chakra-ui/react';
import JustificationModal from '../func/apprenant/JustificationModal'; // Importez la modale

function AttendanceItem({ name, date, time, status, heure_depart, pointageId }) {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Hook pour ouvrir/fermer la modale

  // Determine which image to use based on status
  const getStatusImage = () => {
    switch (status) {
      case 'present':
        return '/images/presence.png';
      case 'retard':
        return '/images/retard.png';
      case 'absent':
        return '/images/absent.png';
      default:
        return '/images/absent.png';
    }
  };

  // Fonction pour afficher la modale uniquement pour les absences
  const handleItemClick = () => {
    if (status === 'absence') {
      onOpen(); // Ouvrir la modale si absent
    }
  };

  return (
    <>
      <ListItem
        display="flex"
        gap={3}
        alignItems="center"
        py={3}
        px={2}
        mx={1}
        bg="whiteAlpha.80"
        borderBottom="1px solid"
        borderColor="gray.300"
        cursor={status === 'absent' ? 'pointer' : 'default'} // Pointer pour absents
        onClick={handleItemClick} // Afficher la modale pour absents
      >

        <Image
          src={getStatusImage()}
          alt={`Status: ${status}`}
          loading="lazy"
          objectFit="contain"
          w="24px"
          h="24px"
          flexShrink={0}
        />
          <Flex direction="column" flex="1" minW="200px">
          <Text fontSize="md" fontWeight="bold" color="gray.800" isTruncated>
            {name}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {date}
          </Text>
        </Flex>
        <Box fontSize="md" fontWeight="medium" color="gray.800" w="full" textAlign="right">
          {time} {heure_depart}
        </Box>
      </ListItem>

      {/* Modal for justification */}
      {status === 'absence' && (
        <JustificationModal
          isOpen={isOpen}
          onClose={onClose}
          pointageId={pointageId}
        />
      )}
    </>
  );
}

export default AttendanceItem;
