import React, {PropsWithChildren} from 'react';
import {useLocation} from 'react-router-dom';
import {route} from '../../constants/route';
import {Footer} from './Footer';
import {Header} from './Header';
import {UserMenu} from './Menu';
import {StyledLayout, Main, MenuWrapper} from './styles';

export const AppLayout: React.FC<PropsWithChildren> = ({children}) => {
  const {pathname} = useLocation();
  const isShowMenu = pathname !== route.main && !pathname.includes(route.login);

  return (
    <StyledLayout>
      <Header />
      <Main>
        {isShowMenu && (
          <MenuWrapper>
            <UserMenu />
          </MenuWrapper>
        )}
        {children}
      </Main>
      <Footer />
    </StyledLayout>
  );
};
