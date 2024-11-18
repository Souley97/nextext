import { Box, Text } from '@chakra-ui/react';

const PromoHeader = () => {
  return (
    <Box position="relative" w="100%" h="14">
      {/* Rectangle de fond */}
      <Box
        position=""
        top="0"
        left="0"
        h="14"
        bg="gray.900"
        opacity="0.8"
        rounded="md"
        justifyContent="space-between"
        display="flex"
      >
        {/* Texte centré */}
        <Text
          textAlign="center"
          color="white"
          fontSize="lg"
          fontWeight="bold"
          justifyContent="center"
          alignItems="center"
          mx="auto"
          my="auto"
          fontFamily="'Nunito Sans', sans-serif"
          m
        >
          Mes promos
        </Text>
      
      </Box>
    </Box>
  );
};

export default PromoHeader;
