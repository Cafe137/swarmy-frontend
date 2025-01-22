import { AppShell, Burger, em, Flex, Group, NavLink, Space } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconBrandDiscord,
  IconChartBar,
  IconCode,
  IconFileInvoice,
  IconFileStack,
  IconKey,
  IconWorldWww,
} from '@tabler/icons-react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { AppIcon } from './AppIcon.tsx';
import { Logo } from './Logo.tsx';
import UserMenu from './UserMenu.tsx';

export default function LoggedInLayout({ children }) {
  const [opened, { toggle }] = useDisclosure();
  const isMobile = useMediaQuery(`(max-width: ${em(767)})`);

  return (
    <>
      <AppShell
        layout="alt"
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header style={{ boxShadow: '#00000066 0px 5px 10px -4px' }} withBorder={false}>
          <Flex mt={6} justify="space-between" align="center" px={'md'}>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            {isMobile ? (
              <Group gap={8}>
                <Logo w={100} />
              </Group>
            ) : (
              <div></div>
            )}
            <UserMenu />
          </Flex>
        </AppShell.Header>

        <AppShell.Navbar>
          <Flex justify={'center'} align={'center'} gap={6}>
            <Group mt={10} gap={8}>
              <AppIcon s={40} />
              <Logo w={100} />
            </Group>
          </Flex>

          <Space h="xl" />
          <NavLink
            component={RouterNavLink}
            onClick={toggle}
            to={'/app/files'}
            label="Files"
            leftSection={<IconFileStack size="1.5rem" stroke={1.5} />}
          />
          <NavLink
            component={RouterNavLink}
            onClick={toggle}
            to={'/app/feeds'}
            label="Feeds"
            leftSection={<IconWorldWww size="1.5rem" stroke={1.5} />}
          />
          <NavLink
            component={RouterNavLink}
            onClick={toggle}
            to={'/app/analytics'}
            label="Analytics"
            leftSection={<IconChartBar size="1.5rem" stroke={1.5} />}
          />
          <NavLink
            component={RouterNavLink}
            onClick={toggle}
            to={'/app/api-keys'}
            label="API keys"
            leftSection={<IconKey size="1.5rem" stroke={1.5} />}
          />
          <NavLink
            component={RouterNavLink}
            onClick={toggle}
            to={'/app/api-guide'}
            label="API guide"
            leftSection={<IconCode size="1.5rem" stroke={1.5} />}
          />
          <NavLink
            component={RouterNavLink}
            onClick={toggle}
            to={'/app/billing'}
            label="Billing"
            leftSection={<IconFileInvoice size="1.5rem" stroke={1.5} />}
          />
          <NavLink
            component={RouterNavLink}
            onClick={toggle}
            to={'https://discord.gg/ApzRhVbZq4'}
            target="_blank"
            label="Discord"
            leftSection={<IconBrandDiscord size="1.5rem" stroke={1.5} />}
          />
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </>
  );
}
