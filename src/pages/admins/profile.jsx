import {  Center, SimpleGrid } from '@chakra-ui/react';
import ProfileComponent from '../../components/common/profile';
import ProfileCardAdministrateur from '../../components/layout/admin/Navbar';
import CardBox from '../../components/common/Card';
import CongeList from '../../components/func/admin/ListeConges';

const Profile = () => {
  return (
    <Center display={'block'}>
      <ProfileCardAdministrateur />
      <SimpleGrid columns={[1,2]}   >
      <CardBox
        mt={6}
        bg="whiteAlpha.80"
        borderRadius="md"
        shadow="md"
        mx={{ base: '12px', md: '13px', lg: '2180px' }}
        px={{ base: '12px', md: '13px', lg: '10px' }}
        // ml={{ base: '10px', sm: '11px', lg: '22%' }} 

        w={{ base: '366px', md: '100%', lg: '100%' }}
        h="95%"
      >
        {/*  ProfileComponent*/}
        <ProfileComponent/>
        {/*  */}
      </CardBox>


     
       <CardBox
       as="section"
       px={{ base: '2px', md: '3px', lg: '20px' }}
       mx={{ base: '2px', md: '3px', lg: '10px' }}
       w="full" 
       maxW={{ base: '366px', md: '100%', lg: '70%' }}
       borderBottom="2px solid"

      
       display={{ base: 'block', md: 'block', lg: 'block' }}
    
      >
        {/*  ProfileComponent*/}
        <CongeList/>
        {/*  */}
      </CardBox>
      </SimpleGrid>
    </Center>
  );
};

export default Profile;
