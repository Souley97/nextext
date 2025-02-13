import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { PiLockKeyOpenFill } from 'react-icons/pi';
import { api } from '../../lib/utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);  // Initialiser à 0 par défaut
  const maxAttempts = 5;
  const [retryAfter, setRetryAfter] = useState(null);  // Initialiser à null par défaut
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const toast = useToast();

  // Accéder à localStorage après que le composant est monté côté client
  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window !== 'undefined') {
      const savedAttempts = parseInt(localStorage.getItem('loginAttempts')) || 0;
      const savedRetryAfter = parseInt(localStorage.getItem('retryAfter')) || null;

      setAttempts(savedAttempts);
      setRetryAfter(savedRetryAfter);
    }

    const checkUserRole = async () => {
      const token = localStorage.getItem('token'); // Utiliser localStorage ou sessionStorage
      if (token) {
        try {
          const roleResponse = await api('user/role', 'GET', null, token);
          if (roleResponse.role) {
            // Redirection en fonction du rôle
            switch (roleResponse.role) {
              case 'Formateur':
                router.push('/formateur');
                break;
              case 'Apprenant':
                router.push('/apprenant');
                break;
              case 'Vigile':
                router.push('/vigile/scanner');
                break;
              case 'ChefDeProjet':
                router.push('/ChefDeProjet');
                break;
              case 'Administrateur':
                router.push('/admins');
                break;
              default:
                setError(
                  "Rôle non reconnu. Veuillez contacter l'administrateur."
                );
            }
          }
        } catch (err) {
          console.error('Erreur lors de la récupération du rôle', err);
        }
      }
    };

    checkUserRole();
  }, [router]);

  // Sauvegarder les tentatives dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('loginAttempts', attempts);
    }
  }, [attempts]);

  // Sauvegarder le délai avant réessai dans localStorage
  useEffect(() => {
    if (retryAfter !== null && typeof window !== 'undefined') {
      localStorage.setItem('retryAfter', retryAfter);
    }
  }, [retryAfter]);

  // Fonction de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Veuillez remplir les deux champs.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api('login', 'POST', { email, password });

      if (response.errors || response.message || response.error) {
        setError(response.errors?.email?.[0] || response.message || response.error);

        // Incrémenter les tentatives seulement si les champs sont remplis
        if (email && password) {
          setAttempts((prevAttempts) => prevAttempts + 1);
        }
      } else if (response.access_token) {
        // Connexion réussie
        setAttempts(0);
        localStorage.removeItem('loginAttempts'); // Réinitialiser les tentatives
        localStorage.removeItem('retryAfter'); // Réinitialiser le délai

        localStorage.setItem('token', response.access_token);
        document.cookie = `refresh_token=${response.refresh_token}; HttpOnly; Secure`;

        toast({
          title: 'Connexion réussie.',
          description: 'Vous êtes connecté.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        const roleResponse = await api('user/role', 'GET', null, response.access_token);
        if (roleResponse.role) {
          switch (roleResponse.role) {
            case 'Formateur':
              router.push('/formateur');
              break;
            case 'Apprenant':
              router.push('/apprenant');
              break;
            case 'Vigile':
              router.push('/vigile/scanner');
              break;
            case 'ChefDeProjet':
              router.push('/ChefDeProjet');
              break;
            case 'Administrateur':
              router.push('/admins');
              break;
            default:
              setError(
                "Rôle non reconnu. Veuillez contacter l'administrateur."
              );
          }
        }
      }
    } catch (err) {
      setError('Erreur lors de la connexion. Veuillez vérifier vos informations.');
    } finally {
      setIsLoading(false);
    }
  };

  // Décompte du temps de réessai
  useEffect(() => {
    if (retryAfter > 0) {
      const intervalId = setInterval(() => {
        setRetryAfter((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else if (retryAfter === 0) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('retryAfter'); // Supprimer le délai une fois écoulé
      }
    }
  }, [retryAfter]);

  // Gestion des tentatives échouées
  useEffect(() => {
    if (attempts >= maxAttempts) {
      setRetryAfter(60); // Attendre 60 secondes avant de réessayer
      const timer = setTimeout(() => {
        setAttempts(0); // Réinitialiser après 60 secondes
        if (typeof window !== 'undefined') {
          localStorage.removeItem('loginAttempts'); // Réinitialiser les tentatives
          localStorage.removeItem('retryAfter'); // Réinitialiser le délai
        }
        setRetryAfter(null);
      }, 60000); // 1 minute d'attente

      return () => clearTimeout(timer);
    }
  }, [attempts]);

  return (
    <div
      style={{
        backgroundImage: `
          linear-gradient(rgba(250, 250, 250, 0.1), rgba(250, 250, 250, 0.4)),
          url(/images/background-simplon-pattern.svg)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Heading as="h3" size="md" py={20} textAlign="center">
        Bienvenue dans la page de connexion
      </Heading>
      {/* <Image w='32' src='/images/logo.png' alt='logo simplon '/> */}

      <Center h="100%" mx={5} bg="whiteAlpha.80">
        <Box
          w="full"
          maxW={{ base: 'sm', md: 'sm', lg: '' }}
          p={10}
          bg="whiteAlpha.80"
          rounded="lg"
          borderTop="2px"
          borderBottom="2px"
          borderColor="#CE0033"
          shadow="lg"
        >
          <Center mb={4}>
            <PiLockKeyOpenFill size={46} />
          </Center>

          <form onSubmit={handleSubmit}>
            <FormControl id="email" mb={4} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                focusBorderColor="red.500"
                shadow="lg"
              />
            </FormControl>

            <FormControl id="password" mb={6} isRequired>
              <FormLabel>Mot de passe</FormLabel>
              <InputGroup size="md">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  focusBorderColor="red.500"
                  shadow="lg"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                    variant="ghost"
                    _hover={{ bg: 'transparent' }}
                    color="gray.500"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {error && <p style={{ color: 'red' }}>{error}</p>}

           

            <Center mb={4}>
              {attempts >= maxAttempts ? ( // Vérifier si le nombre de tentatives est dépassé
                <Box color="red.500" fontSize="sm">
                  {/* Trop de tentatives. Réessayez dans {retryAfter || 60} secondes. */}
                </Box>
              ) : (
                <Button
                  isLoading={isLoading} // Afficher le bouton de chargement
                  loadingText="Connexion..."
                  type="submit"
                  colorScheme="red"
                  w="full"
                
                  bg="red.600"
                  color="white"
                  size="lg"
                  mt={4}
                  isDisabled={isLoading || !email || !password || attempts >= maxAttempts || retryAfter > 0}
                  _hover={{ bg: 'red.600' }}
              
                >
                  Se connecter
                </Button>
              )}
            </Center>

            {retryAfter > 0 && (
              <p style={{ color: 'red' }}>
                Veuillez patienter encore {retryAfter} secondes avant de réessayer.
              </p>
            )}
          </form>
        </Box>
      </Center>
    </div>
  );
};

export default Login;
