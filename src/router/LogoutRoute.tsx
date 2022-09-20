import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import GlobalLayout from '../components/templates/GlobalLayout';
import AuthContainer from '../pages/auth/components/AuthContainer';

import { LoginRouteProps } from './LoginRoute';
import { ROUTES } from './routes';

const Home = lazy(() => import('../pages/home/Home'));
const Login = lazy(() => import('../pages/auth/Login/Login'));
const SignUp = lazy(() => import('../pages/auth/SignUp/SignUp'));

function LogoutRoute({ CommonRoute }: LoginRouteProps) {
  const { login, sign_up } = ROUTES;

  return (
    <Routes>
      <Route path="/" element={<GlobalLayout />}>
        <Route key="home" index element={<Home />} />
        <Route
          path={login}
          element={
            <AuthContainer>
              <Login />
            </AuthContainer>
          }
        />
        <Route
          path={sign_up}
          element={
            <AuthContainer>
              <SignUp />
            </AuthContainer>
          }
        />
        {CommonRoute}
      </Route>
    </Routes>
  );
}
export default LogoutRoute;
