import React from 'react';
import {Button} from 'antd';
import {useAuthState} from 'react-firebase-hooks/auth';
import {NavLink} from 'react-router-dom';
import {route} from '../../constants/route';
import {HeaderWrapper} from './styles';
import {getAuth} from 'firebase/auth';
import {app} from '../../constants/firebase';

export const Header: React.FC = () => {
  const auth = getAuth(app);
  const [user] = useAuthState(auth);

  const onLogout = () => {
    auth.signOut();
  };

  return (
    <HeaderWrapper>
      {user ? (
        <Button type="text" onClick={onLogout}>
          Logout
        </Button>
      ) : (
        <NavLink to={route.login}>
          <Button type="text">Login</Button>
        </NavLink>
      )}
    </HeaderWrapper>
  );
};
