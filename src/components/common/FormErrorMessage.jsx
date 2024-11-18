import { Text } from '@chakra-ui/react';

const FormErrorMessage = ({ message }) => {
  return message ? <Text mt={4} color="red.500">{message}</Text> : null;
};

export default FormErrorMessage;
