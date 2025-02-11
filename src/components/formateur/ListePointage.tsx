import React from 'react';
import { VStack, Flex, Box, Text, List, ListItem } from '@chakra-ui/react';
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

interface Pointage {
  id: string | number;
  type: string;
  date: string;
  // Ajoutez d'autres propriétés selon votre structure de données
}

interface ListePointageProps {
  pointages: Pointage[];
}

const ListePointage: React.FC<ListePointageProps> = ({ pointages }) => {
  if (!pointages || pointages.length === 0) {
    return <Text>Aucun pointage disponible.</Text>;
  }

  // Grouper les pointages par date
  const pointagesParJour = pointages.reduce((acc, pointage) => {
    const date = pointage.date.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(pointage);
    return acc;
  }, {} as Record<string, Pointage[]>);

  return (
    <VStack spacing={4} align="stretch">
      {Object.entries(pointagesParJour).map(([date, pointagesDuJour]) => (
        <Box key={date}>
          <Text fontWeight="bold" mb={2}>
            {new Date(date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <Box p={4} shadow="md" borderWidth="1px">
            <List>
              {pointagesDuJour.map((pointage: Pointage) => (
                <AttendanceItem key={pointage.id} pointage={pointage} />
              ))}
            </List>
          </Box>
        </Box>
      ))}
    </VStack>
  );
};

export default ListePointage;
