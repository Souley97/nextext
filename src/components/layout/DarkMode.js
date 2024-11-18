import { Button, useColorMode } from '@chakra-ui/react';
import { LuSunMoon } from 'react-icons/lu';
import { BsMoonStarsFill } from 'react-icons/bs';

export default function ThemeToggleButton() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button onClick={toggleColorMode}>
      {colorMode === 'light' ? <LuSunMoon /> : <BsMoonStarsFill />}
    </Button>
  );
}
