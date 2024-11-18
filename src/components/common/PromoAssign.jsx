
/* eslint-disable no-unused-vars */

import { Box, Button, Text } from '@chakra-ui/react';
import FormSelect from './FormSelect';
import usePromoAssign from '../../lib/utils/hooks/usePromoAssign';

const PromoAssign = () => {
  const {
    promosData,
    promosDataTerminer,
    formateursData,
    selectedAssistant,
    setSelectedAssistant,
    assignAssistant,
    handlePromoClick,
  } = usePromoAssign();

  const promos = promosData || [];
  const promosTerminer = promosDataTerminer || [];
  const formateurs = formateursData || [];
  console.log('Formateurs data:', formateurs); // To confirm the data

  const handleAssignClick = (promoId) => {
    if (selectedAssistant[promoId]) {
      assignAssistant(promoId, selectedAssistant[promoId]);
    } else {
      alert("Veuillez sélectionner un assistant.");
    }
  };

  return (
    <div>
      {promos.map((promo) => (
        <Box key={promo.id} p={5} shadow="md" borderWidth="1px">
          <Text fontSize="xl">{promo.nom}</Text>
          
          <FormSelect
            id={`assistant_id_${promo.id}`}
            label="Assistant"
            name={`assistant_id_${promo.id}`}
            value={selectedAssistant[promo.id] || ''}
            onChange={(e) => 
              setSelectedAssistant({ ...selectedAssistant, [promo.id]: e.target.value })
            }
            options={(Array.isArray(formateurs) ? formateurs : []).map((assistant) => ({
              value: assistant.id,

              label: assistant.nom,
            }))}
          />

          <Button mt={4} colorScheme="red" onClick={() => handleAssignClick(promo.id)}>
            Assigner assistant
          </Button>
        </Box>
      ))}
      <div>
        <Text fontSize="lg" color="red.500">
          Promotions Terminées
        </Text>
        {promosTerminer.map((promo) => (
          <Box key={promo.id} p={5} shadow="md" borderWidth="1px">
            <Text fontSize="xl">{promo.nom}</Text>
            <Button onClick={() => handlePromoClick(promo.id)}>Voir Détails</Button>
          </Box>
        ))}
      </div>
    </div>
  );
};

export default PromoAssign;
