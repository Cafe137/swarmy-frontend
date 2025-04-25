import { Anchor, Text } from '@mantine/core';
import { CookieConsent } from 'react-cookie-consent';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { Vertical } from './utility/Vertical';

export default function PublicLayout({ children }) {
  return (
    <>
      <Vertical gap={40}>
        <Header />
        <main>{children}</main>
        <Footer />
      </Vertical>
      <CookieConsent
        buttonStyle={{
          background: 'rgb(249, 115, 22)',
          color: 'white',
          fontWeight: 700,
          borderRadius: '5px',
          fontSize: '13px',
        }}
      >
        <Text size={'md'}>
          This website uses cookies to enhance the user experience. You can see our policy
          <Anchor ml={4} component={RouterNavLink} to={'/privacy'}>
            here
          </Anchor>
          .
        </Text>
      </CookieConsent>
    </>
  );
}
