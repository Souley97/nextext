import React from 'react';
import {SimpleGrid } from '@chakra-ui/react';
import FormationCard from './FormationCard';

const promoData = [
  {
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/7b17bbf061b5cd3050ef728ab794d1715ce597c84aa2b8f5b34cc16c42a32adc?placeholderIfAbsent=true&apiKey=5a4129e8dacc4e7b95518ebfcb6a026b",
    title: "P7",
    description: "Developpement web et web mobile",
    location: "Mermoz"
  },
  {
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/7b17bbf061b5cd3050ef728ab794d1715ce597c84aa2b8f5b34cc16c42a32adc?placeholderIfAbsent=true&apiKey=5a4129e8dacc4e7b95518ebfcb6a026b",
    title: "P2",
    description: "Reference digital",
    location: "Pikine"
  },
  {
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/7b17bbf061b5cd3050ef728ab794d1715ce597c84aa2b8f5b34cc16c42a32adc?placeholderIfAbsent=true&apiKey=5a4129e8dacc4e7b95518ebfcb6a026b",
    title: "P3",
    description: "IOT",
    location: "Mermoz"
  }
];

const FormationSection = () => (
  <SimpleGrid overflow="hidden"  columns={1} spacingX={6  } px={1} py={2} w="full" borderRadius="md" mt={{ base: 2.5, md: 0 }}>
  {promoData.slice(0, 3).map((promo, index) => (
    <FormationCard key={index} {...promo} />
  ))}
  {/* <Flex direction="column" ml={{ base: 0, md: 5 }} w={{ base: "full", md: "6/12" }}>
    <Flex direction="column" mt={{ base: 10, md: 9 }} w="full" whiteSpace="nowrap">
      <PromoCard {...promoData[2]} />
    </Flex>
  </Flex> */}
</SimpleGrid>
);

export default FormationSection;