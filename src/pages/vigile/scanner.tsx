'use client';

import {
  Box,
  Container,
  Heading,
  Icon,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaQrcode } from 'react-icons/fa';
import QrReader from 'react-web-qr-reader';
import Swal from 'sweetalert2';
import NavbarVigile from '../../components/layout/vigile/Navbar';

const QRCodeScanner = () => {
  const [result, setResult] = useState(null);
  const [isScanned, setIsScanned] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const scannerSize = useBreakpointValue({ base: 300, md: 380, lg: 440 });

  // useUserWithRoles(['Vigile']);

  const delay = 200;
  const previewStyle = {
    height: scannerSize,
    width: scannerSize,
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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

  const saveScanOffline = (matricule) => {
    const dbRequest = indexedDB.open('QRScannerDB', 1);

    dbRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result;
      
      if (!db.objectStoreNames.contains('scans')) {
        db.createObjectStore('scans', { keyPath: 'id', autoIncrement: true });
      }
    };

    dbRequest.onsuccess = (event: Event) => {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result;
      const transaction = db.transaction('scans', 'readwrite');
      const store = transaction.objectStore('scans');
      store.add({ matricule, timestamp: new Date().toISOString() });
      Swal.fire({
        icon: 'info',
        title: 'Données enregistrées hors-ligne',
        text: `Le matricule ${matricule} a été sauvegardé.`,
      });
    };

    dbRequest.onerror = () => {
      console.error('Erreur IndexedDB');
    };
  };

  const handleValidation = async () => {
    try {
      if (!result) {
        throw new Error('Aucun matricule scanné.');
      }

      const matricule = result.split('\n')[1].split(':')[1].trim();
      const token = localStorage.getItem('token');

      if (!navigator.onLine) {
        saveScanOffline(matricule);
        return;
      }

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
        throw new Error(data.message || 'Erreur lors de la mise à jour.');
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

  const syncOfflineData = () => {
    const dbRequest = indexedDB.open('QRScannerDB', 1);

    dbRequest.onsuccess = async (event: Event) => {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result;
      const transaction = db.transaction('scans', 'readonly');
      const store = transaction.objectStore('scans');
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = async () => {
        const scans = getAllRequest.result;

        for (const scan of scans) {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/pointage/arrivee`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ matricule: scan.matricule }),
              }
            );

            if (response.ok) {
              const deleteTransaction = db.transaction('scans', 'readwrite');
              const deleteStore = deleteTransaction.objectStore('scans');
              deleteStore.delete(scan.id);
            }
          } catch (error) {
            console.error('Erreur lors de la synchronisation:', error);
          }
        }
      };
    };

    dbRequest.onerror = () => {
      console.error('Erreur IndexedDB');
    };
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Code qui utilise 'window' uniquement côté client
      window.addEventListener('online', syncOfflineData);

      // Nettoyer l'écouteur d'événements lors du démontage du composant
      return () => {
        window.removeEventListener('online', syncOfflineData);
      };
    }

    
  }, []); // Le tableau vide [] signifie que cet effet ne s'exécute qu'une seule fois au montage

  
  return (
    <Container maxW="100vw" p={0} h="100vh" position="relative">
      <VStack 
        spacing={8} 
        align="center"
        bg={useColorModeValue('gray.50', 'gray.900')}
        minH="100vh"
        pt={8}
        pb="100px"
      >
        <Box textAlign="center" mb={4}>
          <Icon 
            as={FaQrcode} 
            w={8} 
            h={8} 
            color="red.500" 
            mb={2}
          />
          <Heading 
            size="lg"
            color="#ce0033"
            fontFamily="'Nunito Sans', sans-serif"
          >
            Scanner de QR Code
          </Heading>
          <Text 
            mt={2} 
            color={textColor}
            fontSize="md"
          >
            Placez le QR code dans le cadre pour scanner
          </Text>
        </Box>

        <Box
          bg={bgColor}
          p={4}
          borderRadius="2xl"
          boxShadow="xl"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            inset: '-2px',
            borderRadius: '2xl',
            padding: '2px',
            background: 'linear-gradient(45deg, #ce0033, #ff0044)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        >
          <QrReader
            delay={delay}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
          />
        </Box>

        {result && (
          <Text 
            mt={4} 
            color={textColor}
            fontSize="sm"
            opacity={0.8}
          >
            Dernier scan: {new Date().toLocaleTimeString()}
          </Text>
        )}
      </VStack>

      <Box position={{ base: 'fixed', lg: 'relative' }} bottom={1} left="-25%"  zIndex={10}>
        <NavbarVigile />
      </Box>
    </Container>
  );
};

export default QRCodeScanner;
