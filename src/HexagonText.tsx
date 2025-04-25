import { Text } from '@mantine/core';
import { Horizontal } from './utility/Horizontal';

interface Props {
  children: string;
}

export function HexagonText({ children }: Props) {
  return (
    <Horizontal gap={10}>
      <img style={{ width: '24px' }} src="/assets/hexagon.svg" />
      <Text size="24px">{children}</Text>
    </Horizontal>
  );
}
