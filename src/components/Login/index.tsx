import React, {useState} from 'react';
import {Button, message} from 'antd';
import {
  ConfirmationResult,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
} from 'firebase/auth';
import {collection, addDoc, getDocs, query, where, getFirestore} from 'firebase/firestore';
import {app} from '../../constants/firebase';
import {ModalWindow} from '../modal/ModalWindow';
import {LoginWrapper, LoginButtonsWrapper} from './styles';
import {AuthForm} from './AuthForm';
import {PhoneAuthForm} from './PhoneAuthForm';

export type AuthDataType = {
  name?: string;
  email: string;
  password?: string;
};

export const Login: React.FC = () => {
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const [isPhoneFormOpen, setIsPhoneFormOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [signInWithPhoneRes, setSignInWithPhoneRes] = useState<ConfirmationResult | undefined>();
  const [messageApi, contextHolder] = message.useMessage();

  const onRegisterUser = () => setIsRegister(true);

  const onResetPassword = () => setIsReset(true);

  const onCloseAuthModal = () => {
    setIsEmailFormOpen(false);
    setIsRegister(false);
    setIsReset(false);
  };

  const onClosePhoneModal = () => {
    setIsPhoneFormOpen(false);
  };

  const handleErrorDifferentCredential = async (e: any) => {
    if (e.code === 'auth/account-exists-with-different-credential') {
      const email = e.email;
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.indexOf(EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) != -1) {
        messageApi.open({
          type: 'info',
          content: 'Please sign with email/password',
        });
      }
      if (methods.indexOf(EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD) != -1) {
        messageApi.open({
          type: 'info',
          content: 'Please sign with Google',
        });
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const {user} = await signInWithPopup(auth, provider);
      const q = query(collection(firestore, 'users'), where('uid', '==', user.uid));
      const {docs} = await getDocs(q);
      if (docs.length === 0) {
        await addDoc(collection(firestore, 'users'), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          authProvider: 'google',
        });
      }
    } catch (e) {
      console.error(e);
      handleErrorDifferentCredential(e);
      messageApi.open({
        type: 'error',
        content: (e as Error).message,
      });
    }
  };

  const loginWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const {user} = await signInWithPopup(auth, provider);
      const q = query(collection(firestore, 'users'), where('uid', '==', user.uid));
      const {docs} = await getDocs(q);
      if (docs.length === 0) {
        await addDoc(collection(firestore, 'users'), {
          uid: user.uid,
          name: user.displayName,
          email: user.providerData[0].email,
          photo: user.photoURL,
          authProvider: 'facebook',
        });
      }
    } catch (e) {
      console.error(e);
      handleErrorDifferentCredential(e);
      messageApi.open({
        type: 'error',
        content: (e as Error).message,
      });
    }
  };

  const logInWithEmailAndPassword = async (values: AuthDataType) => {
    const {email, password} = values;
    try {
      await signInWithEmailAndPassword(auth, email, password!);
    } catch (e) {
      console.error(e);
      setIsEmailFormOpen(false);
      messageApi.open({
        type: 'error',
        content: (e as Error).message,
      });
    }
  };

  const registerWithEmailAndPassword = async (values: AuthDataType) => {
    const {name, email, password} = values;
    try {
      const {user} = await createUserWithEmailAndPassword(auth, email, password!);
      await addDoc(collection(firestore, 'users'), {
        uid: user.uid,
        name,
        authProvider: 'local',
        email,
      });
    } catch (e) {
      console.error(e);
      setIsEmailFormOpen(false);
      setIsRegister(false);
      messageApi.open({
        type: 'error',
        content: (e as Error).message,
      });
    }
  };

  const sendPasswordReset = async (values: AuthDataType) => {
    const {email} = values;
    try {
      await sendPasswordResetEmail(auth, email);
      setIsEmailFormOpen(false);
      setIsReset(false);
      messageApi.open({
        type: 'success',
        content: 'Password reset link sent on your email!',
      });
    } catch (e) {
      console.error(e);
      setIsEmailFormOpen(false);
      setIsReset(false);
      messageApi.open({
        type: 'error',
        content: (e as Error).message,
      });
    }
  };

  const loginWithPhone = async (phoneNumber: string) => {
    if (phoneNumber === '' || phoneNumber.length < 10) return;

    try {
      const captchaVerify = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
        },
        auth,
      );
      const res = await signInWithPhoneNumber(auth, phoneNumber, captchaVerify);
      setSignInWithPhoneRes(res);
      setIsOtpOpen(true);
    } catch (e) {
      console.error(e);
      setIsPhoneFormOpen(false);
      setIsOtpOpen(false);
      messageApi.open({
        type: 'error',
        content: (e as Error).message,
      });
    }
  };

  const validateOtp = async (otp: string) => {
    if (otp === null) return;
    try {
      const res = await signInWithPhoneRes?.confirm(otp);
      const user = res?.user;
      const q = query(collection(firestore, 'users'), where('uid', '==', user?.uid));
      const {docs} = await getDocs(q);
      if (docs.length === 0) {
        await addDoc(collection(firestore, 'users'), {
          uid: user?.uid,
          phone: user?.phoneNumber,
          authProvider: 'phone',
        });
      }
    } catch (e) {
      console.error(e);
      setIsPhoneFormOpen(false);
      setIsOtpOpen(false);
      messageApi.open({
        type: 'error',
        content: (e as Error).message,
      });
    }
  };

  return (
    <LoginWrapper>
      {contextHolder}
      <LoginButtonsWrapper>
        <Button type="default" onClick={() => setIsEmailFormOpen((prev) => !prev)}>
          Login with Email
        </Button>
        <Button type="default" onClick={() => setIsPhoneFormOpen((prev) => !prev)}>
          Login with Phone number
        </Button>
        <Button type="default" onClick={loginWithGoogle}>
          Login with Google
        </Button>
        <Button type="default" onClick={loginWithFacebook}>
          Login with Facebook
        </Button>
      </LoginButtonsWrapper>
      <ModalWindow
        visible={isEmailFormOpen || isPhoneFormOpen}
        content={
          isEmailFormOpen ? (
            <AuthForm
              onAuth={
                isRegister ? registerWithEmailAndPassword : isReset ? sendPasswordReset : logInWithEmailAndPassword
              }
              onRegisterUser={onRegisterUser}
              onResetPassword={onResetPassword}
              isRegister={isRegister}
              isReset={isReset}
            />
          ) : (
            <PhoneAuthForm onAuth={isOtpOpen ? validateOtp : loginWithPhone} isOtpOpen={isOtpOpen} />
          )
        }
        onClose={isEmailFormOpen ? onCloseAuthModal : onClosePhoneModal}
      />
    </LoginWrapper>
  );
};
