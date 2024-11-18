import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react';

const FormInput = ({ id, label, name, type, placeholder, value, onChange, error }) => {
  return (
    <FormControl id={id} mb={4} isRequired isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        focusBorderColor="red.500"

        onChange={onChange}
        w="100%"
        py={5}
        shadow="1px 0px 1px 1px #ce0033"
        _focus={{ border: 'red' }}
      />
      {}
      {error && <Text color="#ce0033">{error}</Text>}
    </FormControl>
  );
};

export default FormInput;
