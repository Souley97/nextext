/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Image,
  Link,
} from '@chakra-ui/react';

function JustificationModal({ isOpen, onClose, pointageId }) {
  const [description, setDescription] = useState('');
  const [document, setDocument] = useState(null);
  const [existingJustification, setExistingJustification] = useState(null);
  const toast = useToast();

  // Fetch the existing justification
  const fetchJustification = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/justifier-absence/${pointageId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.justification) {
        setExistingJustification(data.justification);
      }
    } catch (error) {
      console.error("Error fetching justification:", error);
    }
  };

  // Fetch justification when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchJustification();
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!document) {
      toast({
        title: "Erreur",
        description: "Veuillez télécharger un document justificatif.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('document', document);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/justifier-absence/${pointageId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Succès",
          description: "Justificatif soumis avec succès.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose(); // Close the modal after success
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Une erreur est survenue.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Justifier l'absence</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {existingJustification ? (
            <>
              <p>Justificatif déjà soumis :</p>
              <p>Description : {existingJustification.description}</p>

              {/* Display the PDF link or image */}
              {existingJustification.document && (
                existingJustification.document.endsWith('.pdf') ? (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_IMAGE}/${existingJustification.document}`}
                    isExternal
                    color="#CE0033"
                  >
                    Voir le justificatif PDF
                  </Link>
                ) : (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_IMAGE}/${existingJustification.document}`}
                    isExternal
                    color="#CE0033"
                  >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_IMAGE}/${existingJustification.document}`}
                    alt="Justificatif"
                    boxSize="200px"
                  />
                  </Link>
                )
              )}
            </>
          ) : (
            <>
              <FormControl id="description" mt={4}>
                <FormLabel>Description </FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Entrez la raison de l'absence"
                />
              </FormControl>
              <FormControl id="document" mt={4}>
                <FormLabel>Document justificatif</FormLabel>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setDocument(e.target.files[0])}
                />
              </FormControl>
              <Button mt={4} 
                            _hover={{ bg: '#110033' }}
                            color="white"
                            bg="#CE0033"
              onClick={handleSubmit}>
                Soumettre
              </Button>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default JustificationModal;
