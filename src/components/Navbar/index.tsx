import { ChevronRightIcon, ChevronLeftIcon } from '@modulz/radix-icons';
import Icon from 'components/Icon';
import { useCallback, useEffect, useMemo, useState } from 'react';
import NavItem from './NavItem';
import {
  Container,
  LogoContainer,
  NavContainer,
  WrapperContainer,
} from './styles';

import { useNavbar } from 'context/NavbarContext';
import { useAuth } from 'context/AuthContext';
import UserDropdown from './UserDropdown';
import HamburguerMenu from './HamburguerMenu';
import { useSession } from 'next-auth/react';
import Text from 'components/Text';

interface NavbarProps {
  orientation?: 'horizontal' | 'vertical';
  backgroundColor?: 'primary' | 'transparent';
  staticMenu?: boolean;
}

function Navbar({
  orientation = 'horizontal',
  backgroundColor = 'primary',
  staticMenu = false,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { handleNavbarVisibility, navbarVisibility } = useNavbar();
  const { user } = useAuth();
  const showNavbarVisibility = useMemo(
    () => (navbarVisibility ? ChevronRightIcon : ChevronLeftIcon),
    [navbarVisibility]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
        return;
      }

      setScrolled(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Container staticMenu={staticMenu} scrolled={scrolled}>
      <WrapperContainer
        orientation={orientation}
        background={backgroundColor}
        hidden={navbarVisibility}
      >
        {orientation === 'vertical' && (
          <Icon onClick={handleNavbarVisibility} icon={showNavbarVisibility} />
        )}
        <LogoContainer orientation={orientation}>
          <a href="/">
            <img
              src={navbarVisibility ? '/assets/icon.svg' : '/assets/logo.svg'}
              alt="Logo Build Your Trip"
            />
          </a>
        </LogoContainer>

        {scrolled ? (
          <HamburguerMenu />
        ) : (
          <NavContainer orientation="horizontal">
            <NavItem orientation="horizontal" type="link" to="/beaguide">
              Be a guide
            </NavItem>
            <NavItem orientation="horizontal" type="link" to="/support">
              Support
            </NavItem>
            <NavItem orientation="horizontal" type="link" to="/faq">
              FAQ
            </NavItem>

            {user.id ? (
              <UserDropdown />
            ) : (
              <>
                <NavItem
                  orientation="horizontal"
                  type="primary"
                  to="/signup?soft=true"
                >
                  Sign Up
                </NavItem>

                <Text css={{ margin: '0 15px', fontSize: '12px' }}>or</Text>

                <NavItem
                  orientation="horizontal"
                  type="link"
                  css={{ backgroundColor: 'transparent' }}
                  to="/signin"
                >
                  Sign In
                </NavItem>
              </>
            )}
          </NavContainer>
        )}
      </WrapperContainer>
    </Container>
  );
}

export default Navbar;
