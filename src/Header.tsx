import { Anchor, Button } from '@mantine/core';
import { IconApps, IconLogin } from '@tabler/icons-react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { AppIcon } from './AppIcon.tsx';
import { Logo } from './Logo.tsx';
import UserMenu from './UserMenu.tsx';
import { useAuthStore } from './store/AuthStore.ts';
import { useProfileStore } from './store/ProfileStore.ts';
import { Horizontal } from './utility/Horizontal';

export function Header() {
  const signedIn = useAuthStore((state) => state.signedIn());
  const { emailVerified } = useProfileStore();

  return (
    <header>
      <Horizontal between px={10} py={0} borderBottom="1px solid rgb(119, 129, 128)" background="rgb(21, 26, 33)">
        <Anchor style={{ textDecoration: 'none' }} size="sm" component={RouterNavLink} to={'/'}>
          <Horizontal gap={5}>
            <AppIcon s={40} />
            <Logo w={100} />
          </Horizontal>
        </Anchor>
        <Horizontal>
          {signedIn ? (
            <Button disabled={!emailVerified} component={Link} to={'/app'} rightSection={<IconApps size={20} />}>
              App
            </Button>
          ) : (
            <Button component={Link} to={'/login'} rightSection={<IconLogin size={20} />}>
              Sign in
            </Button>
          )}
          {signedIn && <UserMenu />}
        </Horizontal>
      </Horizontal>
    </header>
  );
}
