import { useReactiveVar } from '@apollo/client';
import { Route } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { NotFound } from '../components/organisms/404';
import CheckAdmin from '../components/organisms/CheckAdmin';
import { ConfirmEmail } from '../pages/auth/ConfirmEmail';
import Docs from '../pages/docs';
import DocsIndex from '../pages/docs/mdx/DocsIndex.mdx';
import Roadmap from '../pages/docs/mdx/Roadmap.mdx';
import Contacts from '../pages/docs/mdx/Contacts.mdx';
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
    /** */
    {
      protectRoute: false,
      path: ENDPOINT.docs.basic_patient_registration,
      element: <BasicPatientRegistration />,
    },
    {
      protectRoute: false,
      path: ENDPOINT.docs.basic_prescription_registration,
      element: <BasicPrescriptionRegistration />,
    },
    {
      protectRoute: false,
      path: ENDPOINT.docs.basic_reserve,
      element: <BasicReserve />,
    },
    /** */
    {
      protectRoute: false,
      path: ENDPOINT.docs.roadmap,
      element: <Roadmap />,
    },
    {
      protectRoute: false,
      path: ENDPOINT.docs.contacts,
      element: <Contacts />,
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
      <Route index element={<DocsIndex />} />
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
