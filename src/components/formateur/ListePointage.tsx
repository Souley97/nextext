import React from 'react';
import { VStack, Flex, Box, Text, Image, List, ListItem } from '@chakra-ui/react';
import dayjs from 'dayjs'; // Assurez-vous d'importer dayjs
import NextImage from 'next/image'; // Pour une optimisation des images

// Fonction pour obtenir l'image appropriée en fonction du statut
const getStatusImage = (status) => {
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

const AttendanceItem = ({ pointage }) => {
  return (
    <ListItem
      display="flex"
      gap={3}
      alignItems="center"
      py={3}
      px={4}
      bg="whiteAlpha.80"
      borderBottom="1px solid"
      borderColor="gray.300"
      aria-label={`Pointage de ${pointage.user.prenom || 'Inconnu'} ${pointage.user.nom || 'Inconnu'} - Statut: ${pointage.type}`}
    >
      <NextImage
        src={getStatusImage(pointage.type)}
        alt={`Statut: ${pointage.type}`}
        width={24}
        height={24}
        layout="intrinsic"
        loading="lazy"
      />
      <Flex direction="column" flex="1" minW="200px">
        <Text fontSize="md" fontWeight="bold" color="gray.800" isTruncated>
          {pointage.user.prenom || 'Prenom inconnu'} {pointage.user.nom || 'Nom inconnu'}
        </Text>
      </Flex>
      <Box fontSize="md" fontWeight="medium" color="gray.800" w="full" textAlign="right" fontFamily="Nunito Sans">
        {pointage.heure_present}
      </Box>
    </ListItem>
  );
};

const ListePointage = ({ pointages, promo }) => {
  if (!pointages || pointages.length === 0) {
    return <Text>Aucun pointage disponible.</Text>;
  }

  // Regroupement des pointages par date
  const pointagesParDate = pointages.reduce((acc, pointage) => {
    const date = dayjs(pointage.date).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(pointage);
    return acc;
  }, {});

  return (
    <VStack spacing={4} align="stretch" w="100%">
      {Object.entries(pointagesParDate).map(([date, pointagesDuJour]) => (
        <React.Fragment key={date}>
          <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
            {promo && <Text fontWeight="bold" textAlign="center" mb={3}>Promotion : {promo.nom}</Text>}
            <Text fontWeight="bold" textAlign="center" mb={3}>Date : {date}</Text>
          </Box>
          <Box p={4} shadow="md" borderWidth="1px">
            <List>
              {pointagesDuJour.map((pointage) => (
                <AttendanceItem key={pointage.id} pointage={pointage} />
              ))}
            </List>
          </Box>
        </React.Fragment>
      ))}
    </VStack>
  );
};

export default ListePointage;
