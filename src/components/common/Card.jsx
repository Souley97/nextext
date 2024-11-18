import { Box } from '@chakra-ui/react';

const CardBox = ({ children, ...attrebuts }) => {
  return (
    <Box
      as="section"
      px={{ base: '2px', md: '30px', lg: '20px' }}
      mx={{ base: '2px', md: '1px', lg: '10%' }}
      ml={{ base: '2px', md: '3px', lg: '20%' }}
      py={8}
      mt={7}
      w="full"
      maxW={{ base: '100%', md: '100%', lg: '55%' }}
      borderBottom="2px solid"
      borderTop="2px solid"
      borderColor="#CE0033"
      borderRadius="md"
      shadow="lg"
      style={{
        background: 'rgba(255, 255, 255, 0.2)', // Added quotes around rgba
        borderRadius: '16px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }}
      fontFamily="Nunito Sans"
      flex="2"
      {...attrebuts}
    >
      {children}
    </Box>
  );
};

export default CardBox;
