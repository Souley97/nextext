// pages/_app.js

import { ChakraProvider, extendTheme, useColorMode } from '@chakra-ui/react';
import { ColorModeScript } from '@chakra-ui/react';
import Head from 'next/head';
import { MediaContextProvider } from '../lib/utils/media';

// Define your custom theme settings
const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const theme = extendTheme({ config });

function BackgroundWrapper({ children }) {
  const { colorMode } = useColorMode();  // Chakra's hook to get the current color mode

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
        minHeight: '100vh',  // Ensures full height coverage
      }}
    >
      {children}
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Head>
      <title>{process.env.NEXT_PUBLIC_SITENAME}</title>
      </Head>
      <MediaContextProvider>
        {/* Apply background styles based on color mode */}
        <BackgroundWrapper>
          <Component {...pageProps} />
        </BackgroundWrapper>
      </MediaContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
