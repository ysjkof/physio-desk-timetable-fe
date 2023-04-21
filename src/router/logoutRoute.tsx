import { lazy } from 'react';
import AuthContainer from '../pages/auth/components/AuthContainer';
import {
  AUTHENTICATE_EMAIL,
  LOGIN,
  PRIVACY_POLICY,
  SIGN_UP,
  SIGN_UP_AGREEMENTS,
  TERM_AND_CONDITIONS,
  TIMETABLE,
} from './routes';

const TermAndConditions = lazy(
  () => import('../components/Policies/TermAndConditions')
);
const SignUpAgreements = lazy(
  () => import('../components/Policies/SignUpAgreements')
);
const PrivacyPolicy = lazy(
  () => import('../components/Policies/PrivacyPolicy')
);

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

  { path: TERM_AND_CONDITIONS, element: <TermAndConditions /> },
  { path: SIGN_UP_AGREEMENTS, element: <SignUpAgreements /> },
  { path: PRIVACY_POLICY, element: <PrivacyPolicy /> },
];

export default logoutRoute;
