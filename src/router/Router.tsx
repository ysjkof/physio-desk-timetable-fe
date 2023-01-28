import { lazy, Suspense } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Route } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { ENDPOINT, ROUTES } from './routes';
import ChangeEmail from '../pages/auth/ChangeEmail/ChangeEmail';
import { Initialize } from '../components';

const LandingPage = lazy(
  () => import('../pages/home/components/organisms/LandingPage')
);
const TestPage = lazy(() => import('../pages/TestPage'));
const NotFound = lazy(() => import('../_legacy_components/404'));
const CheckAdmin = lazy(() => import('../components/CheckAdmin'));

const Docs = lazy(() => import('../pages/docs/Docs'));
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
const ConfirmEmail = lazy(
  () => import('../pages/auth/ConfirmEmail/ConfirmEmail')
);

const Loading = lazy(() => import('../_legacy_components/atoms/Loading'));

function Router() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const { confirmEmail, changeEmail, docs } = ROUTES;
  const {
    basicPatientRegistration,
    basicPrescriptionRegistration,
    basicReserve,
    viewDuration,
    viewState,
    viewClinic,
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
      path: basicPatientRegistration,
      element: <BasicPatientRegistration />,
    },
    {
      path: basicPrescriptionRegistration,
      element: <BasicPrescriptionRegistration />,
    },
    {
      path: basicReserve,
      element: (
        <BasicReserve
          createPatientUrl={ROUTES.createPatient}
          createPrescriptionUrl={ROUTES.prescription}
        />
      ),
    },
    /** */
    {
      path: viewDuration,
      element: <ViewDuration />,
    },
    {
      path: viewState,
      element: <ViewState />,
    },
    {
      path: viewClinic,
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
    <Route key={confirmEmail} path={confirmEmail} element={<ConfirmEmail />} />,
    <Route key={changeEmail} path={changeEmail} element={<ChangeEmail />} />,
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
        <Initialize>
          <LoginRoute CommonRoute={CommonRoute} />
        </Initialize>
      ) : (
        <LogoutRoute CommonRoute={CommonRoute} />
      )}
    </Suspense>
  );
}

export default Router;
