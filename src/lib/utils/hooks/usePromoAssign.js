import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';

// Fetch function for SWR with authentication
const fetcher = (url) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Erreur lors de la récupération des données.');
    return res.json();
  });

export default function usePromoAssign() {
  // Fetch promotions in progress and completed
  const { data: promosData, error: promosError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/promos/encours`,
    fetcher
  );
  const { data: promosDataTerminer, error: promosErrorTerminer } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/promos/terminees`,
    fetcher
  );

  // Fetch formateurs (assistants)
  const { data: formateursData, error: formateursError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/formateurs`,
    fetcher
  );

  const [selectedAssistant, setSelectedAssistant] = useState({});
  const router = useRouter();

  // Handle promo selection and redirect
  const handlePromoClick = (promoId) => {
    router.push(`/admins/promos/${promoId}`);
  };

  // Function to assign an assistant to a promo
  const assignAssistant = async (promoId, assistantId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/promos/${promoId}/assign-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ assistant_id: assistantId }),
        }
      );

      if (!response.ok) throw new Error("Erreur lors de l'assignation de l'assistant.");

      const data = await response.json();
      if (data.success) {
        alert('Assistant assigné avec succès.');
      }
    } catch (error) {
      console.error("Erreur lors de l'assignation de l'assistant:", error);
    }
  };

  return {
    promosData,
    promosDataTerminer,
    formateursData,
    promosError,
    promosErrorTerminer,
    formateursError,
    selectedAssistant,
    setSelectedAssistant,
    handlePromoClick,
    assignAssistant,
  };
}
