import CongeUpdateStatus from './CongeUpdateStatus';
import { useState } from 'react';
import {
  Button,

  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
// Exemple d'utilisation dans un composant parent
const ModalComponent = ({ congeId, onUpdateSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      <Button onClick={openModal}>Mettre à jour</Button>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mettre à jour le statut</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CongeUpdateStatus congeId={congeId} onClose={closeModal} onUpdateSuccess={onUpdateSuccess} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};
export default ModalComponent;
