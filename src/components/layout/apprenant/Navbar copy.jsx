/* eslint-disable react/display-name */
import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { FaHamburger, FaHistory, FaQrcode, FaUserAlt } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { getUserWithRoles } from '../../../lib/utils/checkRole';
import { useUserWithRoles } from '../../../lib/utils/hooks/useUserWithRoles';
import ButtonDeconnexion from '../../common/ButtonDeconnexion';
import ThemeToggleButton from '../DarkMode';

const ProfileCardApprenant = React.memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const iconSize = useBreakpointValue({ base: '20px', md: '30px' });
  const isMobile = useBreakpointValue({ base: true, md: false }); // Nouveau point de rupture
  const { roles, user, loading } = useUserWithRoles(['Apprenant']);

  const fullName = useMemo(
    () => (user ? `${user.prenom} ${user.nom}` : ''),
    [user]
  );

  const MobileNav = () => (
    <>
      <Button 
        onClick={onOpen}
        display={{ base: 'block', md: 'none' }}
        position="absolute"
        top={4}
        right={4}
        variant="ghost"
        color="white"
      >
        <FaHamburger boxSize={6} />
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <NavLink
                href="/apprenant/profile"
                icon={FaUserAlt}
                label="Profile"
                iconSize={iconSize}
                onClick={onClose}
              />
              <NavLink
                href="/apprenant"
                icon={FaQrcode}
                label="QR Code"
                iconSize={iconSize}
                onClick={onClose}
              />
              <NavLink
                href="/apprenant/mesPointages"
                icon={FaHistory}
                label="Historique"
                iconSize={iconSize}
                onClick={onClose}
              />
              <Box pt={4}>
                <ThemeToggleButton />
              </Box>
              <Box>
                <ButtonDeconnexion />
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="lg" color="red.500" />
      </Center>
    );
  }

  if (!user) {
    return <p>Une erreur est survenue. Veuillez vous reconnecter.</p>;
  }

  return (
    <Box
      bg="#CE0033"
      roundedBottomEnd="3xl"
      roundedBottomStart="3xl"
      width="100%"
      px={{ base: '1%', md: '1%', lg: '5%' }}
      shadow="lg"
      textAlign="center"
      pt={8}
    >
      <MobileNav />
      <Flex
        justify="space-between"
        align="center"
        width="100%"
        rounded="xl"
        py={2}
        px={{ base: '1%', md: '0px', lg: '10px' }}
      >
        {/* Navigation desktop */}
        <Flex
          display={{ base: 'none', md: 'flex' }}
          justify="space-between"
          align="center"
          bg="white"
          width={{ base: '100%', md: '90%' }}
          rounded="xl"
          py={2}
          px={{ base: '10%', md: '10px', lg: '180px' }}
          color="black"
          shadow="lg"
          border="2px solid #CE0033"
          ml={{ base: '0%', md: '20px', lg: '13%' }}
          mr={{ base: '0%', md: '20px', lg: '7%' }}
        >
          <NavLink
            href="/apprenant/profile"
            icon={FaUserAlt}
            label="Profile"
            iconSize={iconSize}
            buttonSize={buttonSize}
          />
          <NavLink
            href="/apprenant"
            icon={FaQrcode}
            label="QR Code"
            iconSize={iconSize}
          />
          <NavLink
            href="/apprenant/mesPointages"
            icon={FaHistory}
            label="Historique"
            iconSize={iconSize}
            buttonSize={buttonSize}
          />
        </Flex>

        {/* Boutons de déconnexion et bascule de thème */}
        {!isMobile && (
          <Flex
            ml={{ base: '0%', md: '20px', lg: '10%' }}
            mr={{ base: '0%', md: '20px', lg: '0%' }}
          >
            <Popover>
              <PopoverTrigger>
              <Button w="24" rounded="xl" h="24" color="black" bg="white">
              <IoSettingsOutline size={32} />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
              
               
                <Flex p={4}>
                  <PopoverBody>
                    <ThemeToggleButton />
                  </PopoverBody>
                  <PopoverBody>
                    <ButtonDeconnexion />
                  </PopoverBody>
                </Flex>
              </PopoverContent>
            </Popover>
          </Flex>
        )}
      </Flex>

      {isMobile && (
        <Flex justify="center" mt={4} width="100%">
          {/* Affichage des boutons sur mobile en haut */}

          <Popover>
            <PopoverTrigger>
              <Button>
                <IoSettingsOutline />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <Flex p={4}>
                <PopoverBody>
                  <ThemeToggleButton />
                </PopoverBody>
                <PopoverBody>
                  <ButtonDeconnexion />
                </PopoverBody>
              </Flex>
            </PopoverContent>
          </Popover>
        </Flex>
      )}

      <Center display="flex" mt={4} textAlign="center">
        <Box color="white" px={{ base: '8px', md: '10px', lg: '140px' }}>
          <Text
            fontSize={{ base: '20px', md: '20px', lg: '35px' }}
            fontWeight="bold"
          >
            {fullName}
          </Text>
          {roles.length > 0 && <Text>{roles.join(', ')}</Text>}
        </Box>
      </Center>

      <Center mt={4}>
        <Box w="14" h="1" bg="#CE0033" rounded="full" />
      </Center>
    </Box>
  );
});

const NavLink = ({ href, icon: Icon, label, iconSize, onClick }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  const handleClick = (e) => {
    if (onClick) onClick();
  };

  return (
    <Link href={href} passHref>
      <Flex
        as="a"
        onClick={handleClick}
        display="flex"
        flexDirection="column"
        alignItems="center"
        fontSize={iconSize}
        color={isActive ? '#CE0033' : 'black'}
        p={isActive ? 2 : 0}
        borderRadius={isActive ? 'md' : 'none'}
        transition="background-color 0.3s"
        _hover={{ bg: isActive ? undefined : 'rgba(255, 255, 255, 0.1)' }}
      >
        <Icon size={iconSize} />
        <Text mt={2}>{label}</Text>
      </Flex>
    </Link>
  );
};

export async function getServerSideProps(context) {
  const result = await getUserWithRoles(context, ['Apprenant']);
  return result;
}

export default ProfileCardApprenant;
