import { Anchor, Text } from '@mantine/core';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Horizontal } from './utility/Horizontal';

export function Footer() {
  return (
    <footer>
      <Horizontal px={20} py={15} gap={10} background="rgb(21, 26, 33)" borderTop="1px solid rgb(119, 129, 128)" center>
        <Anchor size={'sm'} component={RouterNavLink} to={'https://discord.gg/ApzRhVbZq4'} target="_blank">
          Discord
        </Anchor>

        <Text size={'sm'} c={'gray.5'}>
          |
        </Text>

        <Anchor size={'sm'} component={RouterNavLink} to={'https://ethswarm.org'} target="_blank">
          Swarm
        </Anchor>

        <Text size={'sm'} c={'gray.5'}>
          |
        </Text>

        <Anchor size={'sm'} component={RouterNavLink} to={'/faq'}>
          FAQ
        </Anchor>

        <Text size={'sm'} c={'gray.5'}>
          |
        </Text>

        <Anchor size={'sm'} component={RouterNavLink} to={'/contact'}>
          Contact
        </Anchor>

        <Text size={'sm'} c={'gray.5'}>
          |
        </Text>

        <Anchor size={'sm'} component={RouterNavLink} to={'/privacy'}>
          Privacy
        </Anchor>

        <Text size={'sm'} c={'gray.5'}>
          |
        </Text>

        <Anchor size={'sm'} component={RouterNavLink} to={'/terms-of-service'}>
          Terms of Service
        </Anchor>
      </Horizontal>
    </footer>
  );
}
