import { useReactiveVar } from '@apollo/client';
import { Route } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { NotFound } from '../components/organisms/404';
import CheckAdmin from '../components/organisms/CheckAdmin';
import { ConfirmEmail } from '../pages/auth/ConfirmEmail';
import { Home } from '../pages/home';
import { TestPage } from '../pages/TestPage';
import LoginRoute from './LoginRoute';
import LogoutRoute from './LogoutRoute';
import { ROUTES } from './routes';

function Router() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const CommonRoute = [
    <Route key="home" index element={<Home />} />,
    <Route
      key="test"
      path="test"
      element={
        process.env.NODE_ENV === 'production' ? (
          <CheckAdmin>
            <TestPage />
          </CheckAdmin>
        ) : (
          <TestPage />
        )
      }
    />,
    <Route key="notFound" path="*" element={<NotFound />} />,
    <Route
      key={ROUTES.confirm_email}
      path={ROUTES.confirm_email}
      element={<ConfirmEmail />}
    />,
  ];
  return isLoggedIn ? (
    <LoginRoute CommonRoute={CommonRoute} />
  ) : (
    <LogoutRoute CommonRoute={CommonRoute} />
  );
}

export default Router;
