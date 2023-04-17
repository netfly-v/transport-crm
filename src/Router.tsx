import React, {useContext} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {useAuthState} from 'react-firebase-hooks/auth';
import {route} from './constants/route';
import {MainPage} from './components/MainPage';
import {Login} from './components/Login';
import {User} from './components/User';
import {getAuth} from 'firebase/auth';
import {app} from './constants/firebase';
import {EditUsers} from './components/User/EditUsers';
import {AddTrip} from './components/User/AddTrip';
import {ViewTrips} from './components/User/ViewTrips';
import {UserRoleContext} from './App';
import {UserRoles} from './constants/common';

export const AppRouter: React.FC = () => {
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  const userRole = useContext(UserRoleContext);

  return (
    <Routes>
      <Route path={route.main} element={<MainPage />} />
      <Route path={route.login} element={!user ? <Login /> : <Navigate to={route.user} />} />
      <Route path={route.user} element={user ? <User /> : <Navigate to={route.login} />} />
      <Route
        path={route.editUsers}
        element={userRole === UserRoles.ADMIN ? <EditUsers /> : <Navigate to={route.user} />}
      />
      <Route path={route.addTrip} element={user ? <AddTrip /> : <Navigate to={route.login} />} />
      <Route path={route.viewTrips} element={user ? <ViewTrips /> : <Navigate to={route.login} />} />
    </Routes>
  );
};
