/* eslint-disable react/no-unescaped-entities */
import { Box, Heading, Text, Button, keyframes } from '@chakra-ui/react';
import Link from 'next/link';

// // Animation keyframes for floating effect
// const float = keyframes`
//   0% { transform: translateY(0); }
//   50% { transform: translateY(-10px); }
//   100% { transform: translateY(0); }
// `;



export default function Custom404() {
  return (
    <Box textAlign="center" py={10} px={6} display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      {/* Floating animation for 404 */}
      <Heading
        as="h1"
        size="4xl"
        bgGradient="linear(to-r, red.400, red.400, red.400)"
        backgroundClip="text"
        fontWeight="extrabold"
        // animation={`${float} 3s ease-in-out infinite`}
        mb={6}
      >
        404
      </Heading>

      {/* Subheading */}
      <Text fontSize="2xl" mt={3} mb={2} fontWeight="semibold">
        Oops! Page not found.
      </Text>
      <Text color="gray.500" mb={6} fontSize="lg">
      l semble que la page que vous recherchez n'existe pas ou ait été déplacée.      </Text>

      {/* CTA button with gradient hover effect */}
      <Link href="/" passHref>
        <Button
          size="lg"
          bgGradient="linear(to-r, red.400, red.500, red.500)"
          color="white"
          _hover={{
            bgGradient: "linear(to-r, red.500, red.500, red.400)",
            boxShadow: "xl",
            transition: "all 0.3s ease-in-out"
          }}
        >
          Retour
        </Button>
      </Link>
    </Box>
  );
}
