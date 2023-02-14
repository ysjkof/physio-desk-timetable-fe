import { lazy } from 'react';
import AuthContainer from '../pages/auth/components/AuthContainer';

const ProtectRoute = lazy(() => import('./ProtectRoute'));
const Warning = lazy(() => import('../components/Warning'));

const Home = lazy(() => import('../pages/home/Home'));
const Login = lazy(() => import('../pages/auth/Login/Login'));
const SignUp = lazy(() => import('../pages/auth/SignUp/SignUp'));

const logoutRoute = [
  {
    path: '',
    element: (
      <ProtectRoute whenFail="/tt" failWhenLogin>
        <Home />
      </ProtectRoute>
    ),
  },
  {
    path: 'login',
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
    path: 'sign-up',
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
