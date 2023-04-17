import React, {createContext} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {AppLayout} from './components/Layout';
import {AppRouter} from './Router';
import 'modern-normalize';
import {useAuthState} from 'react-firebase-hooks/auth';
import {Loader} from './components/Loader';
import {getAuth} from 'firebase/auth';
import {app} from './constants/firebase';
import {getFirestore, collection} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';

export const UserRoleContext = createContext<string | undefined>(undefined);

const App: React.FC = () => {
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const [user, loading] = useAuthState(auth);
  const [users] = useCollectionData(collection(firestore, 'users'));

  const role = users?.find((u) => u.uid === user?.uid)?.role;

  if (loading) return <Loader />;

  return (
    <BrowserRouter>
      <UserRoleContext.Provider value={role}>
        <AppLayout>
          <AppRouter />
        </AppLayout>
      </UserRoleContext.Provider>
    </BrowserRouter>
  );
};

export default App;
