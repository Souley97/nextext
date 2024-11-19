import { useState } from 'react';
import {
  Center,
  Button,
  FormErrorMessage,
  useToast,
  SimpleGrid,
  Heading,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import FormInput from '../../../../components/common/FormInput';
import FormSelect from '../../../../components/common/FormSelect';
import useSWR from 'swr';
import ProfileCardFormateur from '../../../../components/layout/formateur/Navbar';
import CardBox from '../../../../components/common/Card';
import MyPromos from '../../../../components/func/formateur/MyPromos';

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
    photo_profile: '',
    sexe: '',
    promotion_id: '',
  });

  // const [promotions, setPromotions] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);

  // Récupérer les promos en cours et terminées
  const { data: promosData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/promos/encours`,
    fetcher
  );
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      // Prepare FormData for multipart/form-data submission
      const formDataObject = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataObject.append(key, formData[key]);
      });

      if (file) {
        formDataObject.append('photo_profile', file); // Add the file if it's selected
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/apprenant/inscrire`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formDataObject, // Send FormData instead of JSON
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage('Apprenant inscrit avec succès !');
        toast({
          title: 'Succès !',
          description: "L'apprenant a été inscrit avec succès.",
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setFormData({
          nom: '',
          prenom: '',
          adresse: '',
          telephone: '',
          email: '',
          photo_profile: '',
          sexe: '',
          promotion_id: '',
        });
        setFile(null);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: 'Une erreur est survenue.' });
        }
      }
    } catch (error) {
      setErrors({ general: "Une erreur est survenue lors de l'inscription." });
    }
  };
  const promos = promosData ? promosData.promos : [];

  return (
    <Center display={'block'}>
      <ProfileCardFormateur />
      <SimpleGrid
        mx={{ base: '2px', md: '3px', lg: '12px' }}
        justifyContent="space-between"
        columns={[1, 2]}
        spacing={8}
      >
        <CardBox
          maxW={{ base: '98%', md: '100%', lg: '80%' }}
          width="100%"
          bg="rgba(255, 255, 255, 0.23)"
          boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
          backdropFilter="blur(2px)"
          WebkitBackdropFilter="blur(2px)" // For Safari support
        >
          <Center><Heading fontSize={{ base: '20px', md: '25 px', lg: '22px' }}   as="h6">Apprenant</Heading>
          </Center>
          <form onSubmit={handleSubmit}>
            <SimpleGrid columns={[1, 2]} mx={{ base: '12px ', md: '12px', lg: '20px'}} spacing={4}>
              <FormInput
                id="nom"
                label="Nom"
                name="nom"
                type="text"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleChange}
                error={errors.nom}
              />
              <FormInput
                id="prenom"
                label="Prénom"
                name="prenom"
                type="text"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={handleChange}
                error={errors.prenom}
              />
              <FormInput
                id="adresse"
                label="Adresse"
                name="adresse"
                type="text"
                placeholder="Adresse"
                value={formData.adresse}
                onChange={handleChange}
                error={errors.adresse}
              />
              <FormInput
                id="telephone"
                label="Téléphone"
                name="telephone"
                type="text"
                placeholder="Téléphone"
                value={formData.telephone}
                onChange={handleChange}
                error={errors.telephone}
              />
              <FormInput
                id="email"
                label="Email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <FormControl id={'photo_profile'} mb={4}>
                <FormLabel>Photo de profil</FormLabel>
                <Input
                  name={'photo_profile'}
                  type={'file'}
                  accept="image/png, image/jpeg"
                  placeholder={'profile'}
                  error={errors.photo_profile}
                  onChange={handleFileChange} // Ensure file is selected
                  w="100%"
                  py={1}
                  h="45px"
                  focusBorderColor="red.500"

                  shadow="1px 0px 1px 1px #ce0033"
                  _focus={{ border: 'red' }}
                />
              </FormControl>

              <FormSelect
                id="sexe"
                label="Sexe"
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                options={[
                  { value: 'homme', label: 'Homme' },
                  { value: 'femme', label: 'Femme' },
                ]}
                error={errors.sexe}
              />
              <FormSelect
                id="promotion_id"
                label="Promotion"
                name="promotion_id"
                value={formData.promotion_id}
                onChange={handleChange}
                options={
                  Array.isArray(promos)
                    ? promos.map((promo) => ({
                        value: promo.id,
                        label: promo.nom, // ou autre champ approprié
                      }))
                    : []
                }
                error={errors.promotion_id}
              />
            </SimpleGrid>

            <Button mt={4} mx="25%" type="submit"
            alignItems='center'
             _hover={{bg:"#110033"}} color="white" bg="#CE0033" width="50%" py={7}>
              Inscrire
            </Button>
          </form>

          <FormErrorMessage message={message} />
          <FormErrorMessage message={errors.general} />
        </CardBox>
        <CardBox>
          {/* Component promos */}
          <MyPromos/>
          {/* Component promos */}

        </CardBox>
      
      </SimpleGrid>
    </Center>
  );
};

export default InscrireApprenantForm;
