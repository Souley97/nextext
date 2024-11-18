import React from 'react';
import { ListItem, Flex, Box, Text, Image } from '@chakra-ui/react';

function AttendanceItem({ name, heure_depard, heur_arrive, status, promos }) {
  // Determine which image to use based on status
  const getStatusImage = () => {
    switch (status) {
      case 'present':
        return '/images/presence.png'; // Path to presence image
      case 'retard':
        return '/images/retard.png'; // Path to retard image
      case 'absent':
        return '/images/absent.png'; // Path to absence image (small correction)
      default:
        return '/images/absence.png'; // Default to absence if status is not recognized
    }
  };

  return (
    <ListItem
      display="flex"
      gap={3}
      alignItems="center"
      py={3}
      px={4} // Use px for consistent padding on both sides
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.300" // Lighter border for better UX
    >
      {/* Status Image */}
      <Image
        src={getStatusImage()}
        alt={`Status: ${status}`}
        loading="lazy"
        objectFit="contain"
        w="24px" // Slightly bigger for better visibility
        h="24px" // Maintain aspect ratio
        flexShrink={0}
      />

      {/* Name and Role */}
      <Flex direction="column" flex="1" minW="200px">
        {' '}
        {/* Reduced width to ensure better mobile responsiveness */}
        <Text fontSize="md" fontWeight="bold" color="gray.800" isTruncated>
          {' '}
          {/* Truncate text for long names */}
          {name}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {promos}
        </Text>
      </Flex>

      {/* heur_arrive Information */}
      <Box
        fontSize="md"
        fontWeight="medium"
        color="gray.800"
        w="full"
        textAlign="right"
        fontFamily="Nunito Sans"
      >
        <Text>
        {heur_arrive} 
        </Text>

        <Text>
        {heure_depard}
        </Text>
   

      </Box>
     
    </ListItem>
  );
}

export default AttendanceItem;
