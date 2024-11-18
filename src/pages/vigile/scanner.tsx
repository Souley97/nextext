'use client';
import { useEffect, useState } from 'react';
import QrReader from 'react-web-qr-reader';
import Swal from 'sweetalert2';
import NavbarVigile from '../../components/layout/vigile/Navbar';
import { Box, Center, Heading } from '@chakra-ui/react';
import { useUserWithRoles } from '../../lib/utils/hooks/useUserWithRoles';

const QRCodeScanner = () => {
  const [result, setResult] = useState(null);
  const [isScanned, setIsScanned] = useState(false);

  useUserWithRoles(['Vigile']);

  const delay = 200;
  const previewStyle = {
    height: 440,
    width: 380,
    borderRadius: '12px',  // Ajout de coins arrondis
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',  // Ombre subtile
  };

  const playSuccessSound = () => {
    const audio = new Audio('/success-sound.mp3');
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture du fichier audio:', error);
    });
  };

  useEffect(() => {
    if (isScanned) {
      playSuccessSound();

      Swal.fire({
        title: 'Information Scannée',
        text: result || 'Aucune donnée scannée',
        icon: 'info',
        confirmButtonText: 'Valider le scan',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await handleValidation();
        } else {
          setIsScanned(false);
        }
      }); 
    }
  }, [isScanned, result]);

  const handleScan = (data) => {
    if (data?.text) {
      const scannedResult = data.text.trim();
      console.log('Scanned QR Code:', scannedResult); 
      setResult(scannedResult);
      setIsScanned(true);
    } else if (data?.binaryData) {
      const qrCodeText = binaryDataToText(data.binaryData).trim();
      console.log('Scanned QR Code from binary data:', qrCodeText); 
      setResult(qrCodeText);
      setIsScanned(true);
    }
  };

  const handleError = (error) => {
    console.error('QR Code Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors du scan.',
    });
  };

  const binaryDataToText = (binaryData) => {
    try {
      const bytes = new Uint8Array(binaryData);
      const text = new TextDecoder().decode(bytes);
      return text;
    } catch (error) {
      console.error('Conversion Error:', error);
      return 'Erreur lors de la conversion des données binaires';
    }
  };

  const handleValidation = async () => {
    try {
      if (!result) {
        throw new Error('Aucun matricule scanné.');
      }

      const matricule = result.split('\n')[1].split(':')[1].trim();
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pointage/arrivee`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ matricule }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.errors
          ? Object.values(data.errors).flat().join(', ')
          : data.message || 'Erreur lors de la mise à jour du statut';
        throw new Error(errorMessage);
      }

      const now = new Date();
      const formattedTime = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      Swal.fire({
        icon: 'success',
        title: 'Statut mis à jour',
        text: `Pointage validé à ${formattedTime}. ${data.message}`, 
        timer: 1000,            
        showConfirmButton: false,  
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Une erreur est survenue lors de la mise à jour du statut.',
      });
    }
  };

  return (
    <>
      <Center display={'block'}
      style={{
        backgroundImage: `
          linear-gradient(rgba(250, 250, 250, 0.1), rgba(250, 250, 250, 0.4)),
          url(/images/background-simplon-pattern.svg)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      h="100vh" mt="0">
        <Center>
          <Heading 
            mt="22px" 
            color="#ce0033" 
            fontFamily="'nonuto', sans-serif"
            animation="fadeIn 1.5s ease-in-out">{`Heure d'arrivée`}</Heading>
        </Center>

        <Center mt={{ base: '22px', md: "60px", lg: "140px" }}>
          <Box 
            zIndex={43}
            boxShadow="0px 4px 15px rgba(0, 0, 0, 0.3)" // Ajoute une ombre
            borderRadius="10px" // Arrondit les coins
            transform="scale(1)"
            transition="transform 0.3s ease-in-out"  >
            <QrReader 
              delay={delay}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
            />
          </Box>
        </Center>

        <NavbarVigile />
      </Center>
    </>
  );
};

export default QRCodeScanner;
