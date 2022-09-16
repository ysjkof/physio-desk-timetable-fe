import { lazy, Suspense } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Route } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { ENDPOINT, ROUTES } from './routes';

const LandingPage = lazy(
  () => import('../pages/home/components/organisms/LandingPage')
);
const TestPage = lazy(() => import('../pages/TestPage'));
const NotFound = lazy(() => import('../components/404'));
const CheckAdmin = lazy(() => import('../utils/CheckAdmin'));

const Docs = lazy(() => import('../pages/docs'));
const DocsIndex = lazy(() => import('../pages/docs/mdx/DocsIndex.mdx'));
const BasicReserve = lazy(() => import('../pages/docs/mdx/BasicReserve.mdx'));
const BasicPatientRegistration = lazy(
  () => import('../pages/docs/mdx/BasicPatientRegistration.mdx')
);
const BasicPrescriptionRegistration = lazy(
  () => import('../pages/docs/mdx/BasicPrescriptionRegistration.mdx')
);
const ViewDuration = lazy(() => import('../pages/docs/mdx/ViewDuration.mdx'));
const ViewState = lazy(() => import('../pages/docs/mdx/ViewState.mdx'));
const ViewClinic = lazy(() => import('../pages/docs/mdx/ViewClinic.mdx'));
const Roadmap = lazy(() => import('../pages/docs/mdx/Roadmap.mdx'));
const Contacts = lazy(() => import('../pages/docs/mdx/Contacts.mdx'));

const LoginRoute = lazy(() => import('./LoginRoute'));
const LogoutRoute = lazy(() => import('./LogoutRoute'));
const ConfirmEmail = lazy(() => import('../pages/auth/ConfirmEmail'));

const Loading = lazy(() => import('../components/atoms/Loading'));

function Router() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { confirm_email, docs } = ROUTES;
  const {
    basic_patient_registration,
    basic_prescription_registration,
    basic_reserve,
    view_duration,
    view_state,
    view_clinic,
    roadmap,
    contacts,
    overview,
  } = ENDPOINT.docs;

  const docsRoute = [
    /** */
    {
      path: overview,
      element: <LandingPage />,
    },
    /** */
    {
      path: basic_patient_registration,
      element: <BasicPatientRegistration />,
    },
    {
      path: basic_prescription_registration,
      element: <BasicPrescriptionRegistration />,
    },
    {
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
      path: view_duration,
      element: <ViewDuration />,
    },
    {
      path: view_state,
      element: <ViewState />,
    },
    {
      path: view_clinic,
      element: <ViewClinic />,
    },
    /** */
    {
      path: roadmap,
      element: <Roadmap />,
    },
    {
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

  return (
    <Suspense fallback={<Loading />}>
      {isLoggedIn ? (
        <LoginRoute CommonRoute={CommonRoute} />
      ) : (
        <LogoutRoute CommonRoute={CommonRoute} />
      )}
    </Suspense>
  );
}

export default Router;
