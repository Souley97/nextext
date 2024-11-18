import { Box, Center, Flex, Text } from '@chakra-ui/react';

function AttendanceSummary({ summary }) {
  const summaryItems = [
    { label: 'Absent', value: summary.absent || '0' },
    { label: 'Retard', value: summary.retard || '0' },
  ];

  return (
    <Center fontFamily="Nunito Sans">
      <Flex
        gap={10}
        justify="center"
        mt={9}
        maxW="full"
        textAlign="center"
        color="white"
        w="225px"
      >
        {summaryItems.map((item, index) => (
          <Box
            key={index}
            flex="1"
            px={4}
            pb={1}
            borderWidth="2px"
            borderColor="#CE0033"
            bg="gray.900"
            borderRadius="lg"
            textAlign="center"
          >
            <Text px={2} p={-3} fontSize="xs" bg="#ce0033" borderRadius="3">
              {item.label}
            </Text>
            <Text mt={2} fontSize="xl" fontWeight="bold">
              {item.value}
            </Text>
          </Box>
        ))}
      </Flex>
    </Center>
  );
}

export default AttendanceSummary;
