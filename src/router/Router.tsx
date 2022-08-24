import { useReactiveVar } from '@apollo/client';
import { Route } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { NotFound } from '../components/organisms/404';
import { ConfirmEmail } from '../pages/confirm-email';
import { Home } from '../pages/home';
import { TestPage } from '../pages/TestPage';
import LoginRoute from './LoginRoute';
import LogoutRoute from './LogoutRoute';
import { ROUTES } from './routes';

function Router() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const CommonRoute = [
    <Route key="home" index element={<Home />} />,
    <Route key="test" path="test" element={<TestPage />} />,
    <Route key="notFound" path="*" element={<NotFound />} />,
    <Route
      key={ROUTES.confirmEmail}
      path={ROUTES.confirmEmail}
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
