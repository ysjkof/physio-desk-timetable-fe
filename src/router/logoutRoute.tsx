import { lazy } from 'react';
import AuthContainer from '../pages/auth/components/AuthContainer';
import { AUTHENTICATE_EMAIL, LOGIN, SIGN_UP, TIMETABLE } from './routes';

const ProtectRoute = lazy(() => import('./ProtectRoute'));
const Warning = lazy(() => import('../components/Warning'));

const Home = lazy(() => import('../pages/home/Home'));
const Login = lazy(() => import('../pages/auth/Login/Login'));
const SignUp = lazy(() => import('../pages/auth/SignUp/SignUp'));

const ConfirmEmail = lazy(
  () => import('../pages/auth/ConfirmEmail/ConfirmEmail')
);

const logoutRoute = [
  { path: AUTHENTICATE_EMAIL, element: <ConfirmEmail /> },
  {
    path: '',
    element: (
      <ProtectRoute whenFail={TIMETABLE} failWhenLogin>
        <Home />
      </ProtectRoute>
    ),
  },
  {
    path: LOGIN,
    element: (
      <ProtectRoute
        whenFail={<Warning type="useAfterLoggedOut" />}
        failWhenLogin
      >
        <AuthContainer>
          <Login />
        </AuthContainer>
      </ProtectRoute>
    ),
  },
  {
    path: SIGN_UP,
    element: (
      <ProtectRoute
        whenFail={<Warning type="useAfterLoggedOut" />}
        failWhenLogin
      >
        <AuthContainer>
          <SignUp />
        </AuthContainer>
      </ProtectRoute>
    ),
  },
];

export default logoutRoute;
