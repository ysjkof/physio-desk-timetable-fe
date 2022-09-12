import { useReactiveVar } from '@apollo/client';
import { Route } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { NotFound } from '../components/organisms/404';
import CheckAdmin from '../components/organisms/CheckAdmin';
import { ConfirmEmail } from '../pages/auth/ConfirmEmail';
import Docs from '../pages/docs';
import BasicPatientRegistration from '../pages/docs/components/organisms/BasicPatientRegistration';
import BasicPrescriptionRegistration from '../pages/docs/components/organisms/BasicPrescriptionRegistration';
import BasicReserve from '../pages/docs/components/organisms/BasicReserve';
import { Home } from '../pages/home';
import { TestPage } from '../pages/TestPage';
import LoginRoute from './LoginRoute';
import LogoutRoute from './LogoutRoute';
import { ENDPOINT, ROUTES } from './routes';

function Router() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const docsRoute = [
    {
      protectRoute: false,
      path: ENDPOINT.docs.basisPatientRegistration,
      element: <BasicPatientRegistration />,
    },
    {
      protectRoute: false,
      path: ENDPOINT.docs.basicPrescriptionRegistration,
      element: <BasicPrescriptionRegistration />,
    },
    {
      protectRoute: false,
      path: ENDPOINT.docs.basicReserve,
      element: <BasicReserve />,
    },
  ];

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
    <Route key="UserDocuments" path={ROUTES.docs} element={<Docs />}>
      <Route index element={<h1>인덱스다</h1>} />
      {docsRoute.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Route>,
  ];

  return isLoggedIn ? (
    <LoginRoute CommonRoute={CommonRoute} />
  ) : (
    <LogoutRoute CommonRoute={CommonRoute} />
  );
}

export default Router;
