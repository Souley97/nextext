// components/common/UserList.js
import { Box, ButtonGroup, Flex, Text } from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';

const UserList = ({ users, userType, onSelectFormateur }) => {
  return (
    <>
      {users.length > 0 ? (
        users.map((user) => (
          <Box
            onClick={() => onSelectFormateur(user)}
            key={user.id}
            minWidth="max-content"
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
          >
            <ButtonGroup gap="2">
              <Flex
                justifyContent="center"
                alignItems="center"
                w="12"
                h="12"
                bg="#CE0033"
                borderRadius="full"
                color="white"
              >
                <FaUsers />
              </Flex>

              <Box ml="4">
                <Text fontSize="lg" fontWeight="bold" fontFamily="Nunito Sans">
                  {user.nom} {user.prenom}
                </Text>
                <Text fontSize="sm" fontFamily="Nunito Sans">
                  {user.role} {/* Afficher le rôle de l'utilisateur */}
                </Text>
              </Box>
            </ButtonGroup>

            <Text fontSize="sm" fontFamily="Nunito Sans">
              {/* Afficher le nombre de promotions selon le rôle */}
              {user.role === 'Formateur' && (
                <>{user.promos_foramateur_count} Promos</>
              )}
              {user.role === 'ChefDeProjet' && (
                <>{user.promos_chef_de_projet_count} Promos</>
              )}
            </Text>
          </Box>
        ))
      ) : (
        <Text>Aucun {userType} trouvé</Text>
      )}
    </>
  );
};

export default UserList;
