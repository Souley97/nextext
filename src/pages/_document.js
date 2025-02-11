// pages/_document.js

import { ColorModeScript } from '@chakra-ui/react';
import { Head, Html, Main, NextScript } from 'next/document';
import { mediaStyles } from '../lib/utils/media';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <style
          type="text/css"
          dangerouslySetInnerHTML={{ __html: mediaStyles }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ce0033" />
      </Head>
      <body>
        {/* This script ensures the correct color mode is applied */}
        <ColorModeScript />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
