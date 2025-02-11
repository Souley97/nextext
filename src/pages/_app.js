// pages/_app.js

import { ChakraProvider, extendTheme, useColorMode } from '@chakra-ui/react';
import { ColorModeScript } from '@chakra-ui/react';
import Head from 'next/head';
import { useEffect } from 'react';
import { MediaContextProvider } from '../lib/utils/media';
import * as serviceWorker from '../lib/serviceWorkerRegistration';

// Configuration du thème Chakra UI
const config = {
  initialColorMode: 'light', // Mode initial : clair
  useSystemColorMode: true, // Utilisation du mode système si disponible
};

const theme = extendTheme({ config });

// Composant pour appliquer un fond adapté au mode couleur
function BackgroundWrapper({ children }) {
  const { colorMode } = useColorMode(); // Hook pour récupérer le mode couleur actuel

  return (
    <div
      style={{
        backgroundImage: colorMode === 'dark'
          ? `
            linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)),
            url(/images/background-simplon-pattern.svg)
          `
          : `
            linear-gradient(rgba(250, 250, 250, 0.6), rgba(250, 250, 250, 0.9)),
            url(/images/background-simplon-pattern.svg)
          `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh', // S'assure que le fond couvre toute la hauteur
      }}
    >
      {children}
    </div>
  );
}

// Composant principal de l'application
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    serviceWorker.register();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      {/* Script pour gérer le mode couleur initial */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />

      {/* Métadonnées de la page */}
      <Head>
        <title>{process.env.NEXT_PUBLIC_SITENAME || 'Simplon Pointage'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Contexte média et application du fond */}
      <MediaContextProvider>
        <BackgroundWrapper>
          <Component {...pageProps} />
        </BackgroundWrapper>
      </MediaContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
