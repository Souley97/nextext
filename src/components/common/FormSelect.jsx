import { FormControl, FormLabel, Select, Text } from '@chakra-ui/react';

const FormSelect = ({ id, label, name, value, onChange, options, error }) => {
  return (
    <FormControl id={id} mb={4} isRequired isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Select  name={name} placeholder="Sélectionner"                    focusBorderColor="red.500"
    shadow="0px 0px 0px 1px #ce0033"
        _focus={{ border: 'red' }} h={10} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value} py={7}>
            {option.label}
          </option>
        ))}
      </Select>
      {error && <Text color="red.500">{error}</Text>}
    </FormControl>
  );
};

export default FormSelect;
