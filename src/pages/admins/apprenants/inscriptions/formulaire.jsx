import { useState } from 'react';
import { Center, Button, Box, FormErrorMessage,useToast, SimpleGrid } from '@chakra-ui/react';
import FormInput from '../../../../components/common/FormInput';
import FormSelect from '../../../../components/common/FormSelect';
import useSWR from 'swr';
import ProfileCardAdministrateur from '../../../../components/layout/admin/Navbar';

const fetcher = (url) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Erreur lors de la récupération des données.');
    return res.json();
  });
const InscrireApprenantForm = () => {
  const toast = useToast(); // Hook pour afficher des notifications

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    adresse: '',
    telephone: '',
    email: '',
    password: '',
    photo_profile: '',
    sexe: '',
    promotion_id: ''
  });

  // const [promotions, setPromotions] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Récupérer les promos en cours et terminées
  const { data: promosData} = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/promos/encours`,
    fetcher
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/apprenant/inscrire`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formData),
        }
      );
  
      const data = await response.json();

      if (response.ok) {

        setMessage('Apprenant inscrit avec succès !');
        toast({
          title: "Succès !",
          description: "L'apprenant a été inscrit avec succès.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setFormData({
          nom: '',
          prenom: '',
          adresse: '',
          telephone: '',
          email: '',
          password: '',
          photo_profile: '',
          sexe: '',
          promotion_id: ''
        });
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: 'Une erreur est survenue.' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Une erreur est survenue lors de l\'inscription.' });
    }
  };
  const promos = promosData ? promosData.promos : [];

  return (
    
    <Center display={'block'}>
          <ProfileCardAdministrateur />

          <Box mt={5} p={5}borderRadius="lg" width="100%" maxW={{ base:"98%",md: "100%", lg:"40%" }}  borderTop="2px" 
  borderBottom="2px"
    borderColor="#CE0033" 
    // borderColor="red" // Utilisation de la couleur définie dans le thème

  shadow="lg"
  >
        <form onSubmit={handleSubmit}>
        <SimpleGrid columns={[1, 2]} spacing={4}>

          <FormInput id="nom" label="Nom" name="nom" type="text" placeholder="Nom" value={formData.nom} onChange={handleChange} error={errors.nom} />
          <FormInput id="prenom" label="Prénom" name="prenom" type="text" placeholder="Prénom" value={formData.prenom} onChange={handleChange} error={errors.prenom} />
          <FormInput id="adresse" label="Adresse" name="adresse" type="text" placeholder="Adresse" value={formData.adresse} onChange={handleChange} error={errors.adresse} />
          <FormInput id="telephone" label="Téléphone" name="telephone" type="text" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} error={errors.telephone} />
          <FormInput id="email" label="Email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} error={errors.email} />
          <FormInput id="password" label="Mot de passe" name="password" type="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} error={errors.password} />
          <FormInput id="photo_profile" label="Photo de profil (URL)" name="photo_profile" type="text" placeholder="URL de la photo de profil" value={formData.photo_profile} onChange={handleChange} error={errors.photo_profile} />
          <FormSelect
            id="sexe"
            label="Sexe"
            name="sexe"
            value={formData.sexe}
            onChange={handleChange}
            options={[
              { value: 'homme', label: 'Homme' },
              { value: 'femme', label: 'Femme' }
            ]}
            error={errors.sexe}
          />
        <FormSelect
  id="promotion_id"
  label="Promotion"
  name="promotion_id"
  value={formData.promotion_id}
  onChange={handleChange}
  options={Array.isArray(promos) ? promos.map(promo => ({
    value: promo.id,
    label: promo.nom // ou autre champ approprié
  })) : []}
  error={errors.promotion_id}
/>
        </SimpleGrid>

          <Button type="submit" color="white" bg="#CE0033" width="full">
            Inscrire Apprenant
          </Button>
      
        </form>

        <FormErrorMessage message={message} />
        <FormErrorMessage message={errors.general} />
      </Box>
    </Center>
  );
};

export default InscrireApprenantForm;
