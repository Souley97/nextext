import { useState, useEffect } from 'react';
import ListePointage from '../../../components/func/vigile/ListePointage';
import NavbarVigile from '../../../components/layout/vigile/Navbar';
import { Box, Text } from '@chakra-ui/react';
import ButtonDeconnexion from '../../../components/common/ButtonDeconnexion';
import { useUserWithRoles } from '../../../lib/utils/hooks/useUserWithRoles';

export default function PointageAujourdhui() {
  useUserWithRoles(['Vigile']);

  const [pointages, setPointages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPointages = async () => {
      try {
        // Retrieve the token from localStorage or wherever it's stored
        const token = localStorage.getItem('token'); // Adjust this to how you're managing tokens

        // Fetch pointages with the token included in the headers
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pointages/aujourdhui`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de la récupération des pointages.');
        }

        setPointages(data.pointages);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPointages();
  }, []);

  return (
    <Box
    mx={5}
    >
      <ButtonDeconnexion />
      {loading ? (
        <Text>Chargement des pointages...</Text>
      ) : error ? (
        <Text>Erreur : {error}</Text>
      ) : pointages.length === 0 ? (
        <Text>{`Aucun pointage pour aujourd'hui.`}</Text>
      ) : (
        <ListePointage pointages={pointages} />
      )}

      <NavbarVigile />
    </Box>
  );
}
