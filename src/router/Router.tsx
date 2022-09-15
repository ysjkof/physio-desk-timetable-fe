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
import { TestPage } from '../pages/TestPage';
import LoginRoute from './LoginRoute';
import LogoutRoute from './LogoutRoute';
import { ENDPOINT, ROUTES } from './routes';
import LandingPage from '../pages/home/components/organisms/LandingPage';

function Router() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { confirm_email, docs } = ROUTES;
  const {
    basic_patient_registration,
    basic_prescription_registration,
    basic_reserve,
    roadmap,
    contacts,
    overview,
  } = ENDPOINT.docs;

  const docsRoute = [
    /** */
    {
      protectRoute: false,
      path: overview,
      element: <LandingPage />,
    },
    /** */
    {
      protectRoute: false,
      path: basic_patient_registration,
      element: <BasicPatientRegistration />,
    },
    {
      protectRoute: false,
      path: basic_prescription_registration,
      element: <BasicPrescriptionRegistration />,
    },
    {
      protectRoute: false,
      path: basic_reserve,
      element: <BasicReserve />,
    },
    /** */
    {
      protectRoute: false,
      path: roadmap,
      element: <Roadmap />,
    },
    {
      protectRoute: false,
      path: contacts,
      element: <Contacts />,
    },
  ];

  const CommonRoute = [
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
      key={confirm_email}
      path={confirm_email}
      element={<ConfirmEmail />}
    />,
    <Route key="UserDocuments" path={docs} element={<Docs />}>
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
