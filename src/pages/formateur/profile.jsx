import {  Center, SimpleGrid } from '@chakra-ui/react';
import ProfileCardFormateur from '../../components/layout/formateur/Navbar';
import ProfileComponent from '../../components/common/profile';
import CardBox from '../../components/common/Card';

const Profile = () => {
  return (
    <Center display={'block'}>
      <ProfileCardFormateur></ProfileCardFormateur>
      <SimpleGrid columns={[1,1]}   >
      <CardBox
        mt={6}
        bg="whiteAlpha.80"
        borderRadius="md"
        shadow="md"
        ml={{ base: '10px', sm: '11px', lg: '22%' }} 
        w={{ base: '366px', md: '100%', lg: '100%' }}
        h="95%"
      >
        {/*  ProfileComponent*/}
        <ProfileComponent/>
        {/*  */}
      </CardBox>


     

      </SimpleGrid>
    </Center>
  );
};

export default Profile;
