import { lazy } from 'react';
import { ROUTES } from './routes';
import AuthContainer from '../pages/auth/components/AuthContainer';
import ProtectRoute from './ProtectRoute';
import NotFound from '../_legacy_components/404';

const Home = lazy(() => import('../pages/home/Home'));
const Login = lazy(() => import('../pages/auth/Login/Login'));
const SignUp = lazy(() => import('../pages/auth/SignUp/SignUp'));

const { login, signUp } = ROUTES;

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
      <ProtectRoute whenFail={<NotFound />} failWhenLogin>
        <AuthContainer>
          <Login />
        </AuthContainer>
      </ProtectRoute>
    ),
  },
  {
    path: 'sign-up',
    element: (
      <ProtectRoute whenFail={<NotFound />} failWhenLogin>
        <AuthContainer>
          <SignUp />
        </AuthContainer>
      </ProtectRoute>
    ),
  },
];

export default logoutRoute;
