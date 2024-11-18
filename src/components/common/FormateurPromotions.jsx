import { Box, Flex, Icon, SimpleGrid, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { FaUsers } from 'react-icons/fa';

const FormateurPromotions = ({ formateur, isCompleted = false }) => {
  if (!formateur) {
    return <Text>Sélectionnez un formateur pour voir ses promotions.</Text>;
  }

  const { promos_chef_de_projet, promos_foramateur, role } = formateur;

  const promotions =
    role === 'ChefDeProjet' ? promos_chef_de_projet : promos_foramateur;

  return (
    <>
      <Box shadow="md" borderWidth="1px" borderRadius="lg" p={5} mt={5}>
        <Text fontSize="2xl" fontWeight="bold" mb={5}>
          {/* {isCompleted ? 'Terminées' : 'En cours'} */}
          Promos
        </Text>
        <SimpleGrid
          mx={{ base: '2px', md: '13px', lg: '12px' }}
          justifyContent="space-between"
          columns={[1, 2]}
          spacing={2}
        >
          {promotions && promotions.length > 0 ? (
            promotions.map((promo) => (
              <Link href={`/admins/promos/${promo.id}`} key={promo.id}>
                <Box
                  key={promo.id}
                  w="100%"
                  h="16"
                  bg="whiteAlpha.80"
                  borderRadius="md"
                  boxShadow="2xl"
                  p="4"
                  my={2}
                  display="flex"
                  alignItems="center"
                  cursor="pointer"
                  border="1px solid"
                  shadow="1px 0px 4px 1px rgba(0,0,0,0.25)"
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
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      fontFamily="Nunito Sans"
                    >
                      {promo.nom}{' '}
                    </Text>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      fontFamily="Nunito Sans"
                    >
                      {promo.date_debut} - {promo.date_fin}{' '}
                    </Text>
                  </Box>
                </Box>
              </Link>
            ))
          ) : (
            <Text>Aucune promotion disponible.</Text>
          )}
        </SimpleGrid>
      </Box>
    </>
  );
};

export default FormateurPromotions;
