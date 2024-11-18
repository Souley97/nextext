import React, { useState, useEffect } from 'react';
import {
  Box, Center, Text, Avatar, Button, Input, IconButton, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon
} from '@chakra-ui/react';
import { useUserWithRoles } from '../../lib/utils/hooks/useUserWithRoles';
import { FiCamera } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function ProfileComponent() {
  const { user } = useUserWithRoles(['Formateur', 'ChefDeProjet', 'Apprenant', 'Vigile', 'Administrateur']);
  
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [photoProfile, setPhotoProfile] = useState('');
  const [currentPassword, setCurrentPassword] = useState(''); // New state for current password
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    if (user) {
      setAdresse(user.adresse || '');
      setTelephone(user.telephone || '');
      setPhotoProfile(user.photo_profile || '');
    }
  }, [user]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };


  const handleImageClick = () => {
    document.getElementById('image-upload').click();
  };
  const validateInputs = () => {
    const newErrors = {};
    if (!adresse) newErrors.adresse = "L'adresse est requise.";
    if (!telephone) newErrors.telephone = "Le téléphone est requis.";
    if (password && password.length < 8) newErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // return true if no errors
};



  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return; // Validate before proceeding

    setErrors({}); // Clear previous errors

    const formData = new FormData();
    formData.append('adresse', adresse);
    formData.append('telephone', telephone);
    if (password) {
        formData.append('current_password', currentPassword);
        formData.append('password', password);
    }
    if (imageFile) {
        formData.append('photo_profile', imageFile);
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update/information`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            Swal.fire('Success', 'Profile updated successfully!', 'success');
            // Optionally, refresh the user data or redirect
        } else {
            setErrors(data.errors || {});
        }
    } catch (error) {
        console.error('Error during update:', error);
    }
};


  if (!user) {
    return <Center>Chargement des informations utilisateur...</Center>;
  }

  return (
    <Box bg="whiteAlpha.80" w={{ base: '366px', md: '100%', lg: '100%' }} p={4}>
      <form onSubmit={handleUpdate}>
        {/* Profile Section */}
        <Center mt={6} flexDirection="column">
          <Box position="relative" display="inline-block">
            <Avatar
              size="2xl"
              name={user?.nom}
              src={user?.photo_profile ? `${process.env.NEXT_PUBLIC_API_IMAGE}/${user.photo_profile}` : '/profile-image.jpg'}
              onClick={handleImageClick}
              cursor="pointer"
              border="4px solid #CE0033"
            />
            <IconButton
              aria-label="Change profile picture"
              icon={<FiCamera />}
              position="absolute"
              bottom="0"
              right="0"
              size="xl"
              onClick={handleImageClick}
              bg="gray.600"
              color="white"
              borderRadius="full"
              _hover={{ bg: 'gray.500' }}
              transition="all 0.3s ease-in-out"
              
            />
          </Box>

          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            display="none"
          />

          <Text fontSize="xl" mt={4}>
            {user?.email}
          </Text>
        </Center>

        {/* Profile Details */}
        <Box bg="whiteAlpha.80" p={4} mt={4}>
          <Text fontWeight="bold">Adresse</Text>
          <Input
            type="text"
            placeholder="Entrez votre adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            focusBorderColor="#CE0033"
            border="0"
            borderBottom="2px"
          />
          {errors.adresse && <Text color="#CE0033">{errors.adresse[0]}</Text>}
        </Box>

        <Box bg="whiteAlpha.80" p={4} mt={4}>
          <Text fontWeight="bold">Téléphone</Text>
          <Input
            type="tel"
            placeholder="Entrez votre téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            focusBorderColor="#CE0033"
            border="0"
            borderBottom="2px"
          />
          {errors.telephone && <Text color="#CE0033">{errors.telephone[0]}</Text>}
        </Box>

        {/* Accordion for Password Fields */}
        <Accordion allowToggle mt={4}>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Modifier le mot de passe
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              {/* Current Password */}
              <Box bg="whiteAlpha.80" py={4} mt={4}>
                <Text fontWeight="bold">Mot de passe actuel</Text>
                <Input
                  type="password"
                  placeholder="Entrez votre mot de passe actuel"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  focusBorderColor="#CE0033"
                  border="0"
                  borderBottom="2px"
                />
                {errors.currentPassword && <Text color="#CE0033">{errors.currentPassword[0]}</Text>}
              </Box>

              {/* New Password */}
              <Box bg="whiteAlpha.80" py={4} mt={4}>
                <Text fontWeight="bold">Nouveau mot de passe</Text>
                <Input
                  type="password"
                  placeholder="Entrez un nouveau mot de passe (facultatif)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  focusBorderColor="#CE0033"
                  border="0"
                  borderBottom="2px"
                />
                {errors.password && <Text color="#CE0033">{errors.password[0]}</Text>}
              </Box>

              {/* Confirm Password */}
              <Box bg="whiteAlpha.80" py={4} mt={4}>
                <Text fontWeight="bold">Confirmer le nouveau mot de passe</Text>
                <Input
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  focusBorderColor="#CE0033"
                  border="0"
                  borderBottom="2px"
                />
                {errors.confirmPassword && <Text color="#CE0033">{errors.confirmPassword[0]}</Text>}
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        {/* Update Button */}
        <Center mt={6}>
          <Button color="white" _hover={{ bg: '#110033' }} bg="#CE0033" size="lg" type="submit">
            Mise à jour
          </Button>
        </Center>
      </form>
    </Box>
  );
}
