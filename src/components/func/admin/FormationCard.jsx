import { Box, ButtonGroup, Flex, Icon, Text } from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6';

const FormationCard = ({ onDelete, formation, onSelect }) => (
  <Box
    // minWidth="max-content"
    alignItems="center"
    gap="2"
    w="100%"
    maxW={{ base: '366px', md: '12vh', lg: '100%' }}
    h="16"
    bg="whiteAlpha.80"
    shadow="1px 0px 6px 2px rgba(0,0,0,0.25)"
    p="2"
    border="1px solid white"
    my={2}
    justifyContent="space-between"
    display="flex"
    cursor="pointer"
    borderColor="gray.200"
    onClick={() => onSelect(formation)}
  >
    <ButtonGroup gap="2">
      <Flex
        justifyContent="center"
        alignItems="center"
        w="12"
        bg="#CE0033"
        borderRadius="full"
        color="white"
      >
        <Icon as={FaUsers} boxSize={6} />
      </Flex>

      <Box ml="4">
        <Text fontSize="lg" fontWeight="bold" fontFamily="Nunito Sans">
          {formation.nom}
        </Text>
        <Text fontSize="sm" fontFamily="Nunito Sans">
          {formation.promos_count}
          Promos
        </Text>
      </Box>
    </ButtonGroup>

    <FaDeleteLeft onClick={onDelete} colorScheme="red"></FaDeleteLeft>
  </Box>
);

export default FormationCard;
