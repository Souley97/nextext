import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa'; // Import an icon for the user group

const PromoCard = ({ promos, handlePromoClick, isCompleted = false }) => {
  return (
    <Box p={1} mt={1}>
      <Text fontSize="2xl" fontWeight="bold" mb={5}>
        {isCompleted ? 'Terminées' : 'Promos'}
      </Text>
      {promos.map((promo) => (
        <Box
          onClick={() => handlePromoClick(promo.id)}
          key={promo.id}
          w="100%"
          h="16"
          bg="whiteAlpha.80"
          borderRadius="md"
          boxShadow="2xl"
          shadow="1px 0px 10px 2px rgba(0,0,0,0.25)"
          p="4"
          my={4}
          display="flex"
          alignItems="center"
          cursor="pointer"
          border="1px solid"
          borderColor="gray.200" // Lighter border for better UX
        >
          {/* Icon */}
          <Flex
            justifyContent="center"
            alignItems="center"
            w="12"
            h="12"
            bg="#CE0033"
            borderRadius="full"
            color="white"
          >
            <Icon as={FaUsers} boxSize={6} />
          </Flex>

          {/* Text Information */}
          <Box ml="4">
            <Text fontSize="lg" fontWeight="bold" fontFamily="Nunito Sans">
              {promo.nom}{' '}
            </Text>
            <Text fontSize="sm" color="gray.600" fontFamily="Nunito Sans">
              {promo.fabrique && promo.fabrique.nom
                ? promo.fabrique.nom
                : 'Fabrique'}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default PromoCard;
