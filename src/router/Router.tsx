import { lazy } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Route } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { ENDPOINT, ROUTES } from './routes';

const LandingPage = lazy(
  () => import('../pages/home/components/organisms/LandingPage')
);
const TestPage = lazy(() => import('../pages/TestPage'));
const NotFound = lazy(() => import('../components/organisms/404'));
const CheckAdmin = lazy(() => import('../components/organisms/CheckAdmin'));

const Docs = lazy(() => import('../pages/docs'));
const DocsIndex = lazy(() => import('../pages/docs/mdx/DocsIndex.mdx'));
const BasicReserve = lazy(() => import('../pages/docs/mdx/BasicReserve.mdx'));
const BasicPatientRegistration = lazy(
  () => import('../pages/docs/mdx/BasicPatientRegistration.mdx')
);
const BasicPrescriptionRegistration = lazy(
  () => import('../pages/docs/mdx/BasicPrescriptionRegistration.mdx')
);
const Roadmap = lazy(() => import('../pages/docs/mdx/Roadmap.mdx'));
const Contacts = lazy(() => import('../pages/docs/mdx/Contacts.mdx'));

const LoginRoute = lazy(() => import('./LoginRoute'));
const LogoutRoute = lazy(() => import('./LogoutRoute'));
const ConfirmEmail = lazy(() => import('../pages/auth/ConfirmEmail'));

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
      element: (
        <BasicReserve
          createPatientUrl={ROUTES.create_patient}
          createPrescriptionUrl={ROUTES.prescription}
        />
      ),
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
