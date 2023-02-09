import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ENDPOINT, ROUTES } from './routes';
import ChangeEmail from '../pages/auth/ChangeEmail/ChangeEmail';
import App from '../App';
import logoutRoute from './logoutRoute';
import loginRoute from './loginRoute';

const LandingPage = lazy(
  () => import('../pages/home/components/organisms/LandingPage')
);
const NotFound = lazy(() => import('../components/NotFound'));

const CheckAdmin = lazy(() => import('../components/CheckAdmin'));
const TestPage = lazy(() => import('../pages/TestPage'));

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

const ConfirmEmail = lazy(
  () => import('../pages/auth/ConfirmEmail/ConfirmEmail')
);

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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      ...logoutRoute,
      ...loginRoute,
      { path: confirmEmail, element: <ConfirmEmail /> },
      { path: changeEmail, element: <ChangeEmail /> },
      {
        path: docs,
        element: <Docs />,
        children: [
          { path: '', element: <DocsIndex /> },
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
            element: <BasicReserve />,
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
        ],
      },
      {
        path: 'test',
        element:
          import.meta.env.MODE === 'development' ? (
            <TestPage />
          ) : (
            <CheckAdmin>
              <TestPage />
            </CheckAdmin>
          ),
      },
    ],
    errorElement: <NotFound />,
  },
]);

export default router;
