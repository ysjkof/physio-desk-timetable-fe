import { lazy } from 'react';
import { ROUTES } from './routes';
import ProtectRoute from './ProtectRoute';
import Warning from '../_legacy_components/atoms/Warning';
import CreatePrescription from '../pages/legacy_dashboard/components/organisms/CreatePrescription';

const TimeTable = lazy(() => import('../pages/timetable/Timetable'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const CreateClinic = lazy(
  () => import('../pages/legacy_dashboard/components/organisms/CreateClinic')
);
const InviteClinic = lazy(
  () => import('../pages/legacy_dashboard/components/organisms/InviteClinic')
);
const Members = lazy(
  () => import('../pages/legacy_dashboard/components/organisms/Members')
);
const MyClinics = lazy(
  () => import('../pages/legacy_dashboard/components/organisms/MyClinics')
);
const PrescriptionPage = lazy(
  () =>
    import('../pages/legacy_dashboard/components/organisms/PrescriptionPage')
);
const Statistics = lazy(
  () => import('../pages/legacy_dashboard/components/organisms/Statistics')
);
const EditProfile = lazy(
  () => import('../pages/legacy_dashboard/components/organisms/EditProfile')
);
const Search = lazy(() => import('../pages/search/Search'));

const {
  member,
  invite,
  prescription,
  statistics,
  create,
  clinics,
  editProfile,
} = ROUTES;

const loginRoute = [
  {
    path: 'tt',
    element: (
      <ProtectRoute whenFail={<Warning type="verifyEmail" />} failWhenLogout>
        <TimeTable />
      </ProtectRoute>
    ),
  },
  {
    path: 'search',
    element: (
      <ProtectRoute whenFail={<Warning type="verifyEmail" />} failWhenLogout>
        <Search />
      </ProtectRoute>
    ),
  },
  { path: 'dashboard/clinic', element: <Dashboard /> },
  {
    path: clinics,
    element: <MyClinics />,
  },
  {
    path: create,
    element: (
      <ProtectRoute whenFail={<Warning type="verifyEmail" />} failWhenLogout>
        <CreateClinic />
      </ProtectRoute>
    ),
  },
  {
    path: invite,
    element: (
      <ProtectRoute whenFail={<Warning type="verifyEmail" />} failWhenLogout>
        <InviteClinic />
      </ProtectRoute>
    ),
  },
  {
    path: member,
    element: <Members />,
  },
  {
    path: prescription,
    element: <PrescriptionPage />,
    children: [
      {
        path: 'create-prescription',
        element: <CreatePrescription />,
      },
    ],
  },
  {
    path: statistics,
    element: (
      <ProtectRoute whenFail={<Warning type="verifyEmail" />} failWhenLogout>
        <Statistics />
      </ProtectRoute>
    ),
  },
  {
    path: editProfile,
    element: <EditProfile />,
  },
];

export default loginRoute;
