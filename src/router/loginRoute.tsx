import { lazy } from 'react';
import { ROUTES } from './routes';
import CreatePrescription from '../pages/legacy_dashboard/components/organisms/CreatePrescription';
import {
  MemberDetail,
  MemberManagement,
  NotSelected,
  PrescriptionManagement,
} from '../pages/dashboard/components';
import Setting from '../pages/setting/Setting';

const ProtectRoute = lazy(() => import('./ProtectRoute'));
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
const Warning = lazy(() => import('../components/Warning'));

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
    path: 'setting',
    element: <Setting />,
  },
  {
    path: 'dashboard/clinic/members',
    element: <Dashboard />,
    children: [
      {
        path: '',
        element: <MemberManagement />,
        children: [
          { path: '', element: <NotSelected /> },
          {
            path: ':memberId',
            element: <MemberDetail />,
          },
        ],
      },
    ],
  },
  {
    path: 'dashboard/clinic/prescriptions',
    element: <Dashboard />,
    children: [
      {
        path: '',
        element: <PrescriptionManagement />,
        children: [
          { path: 'create', element: <></> },
          { path: ':prescriptionId/edit', element: <></> },
        ],
      },
    ],
  },
  { path: 'dashboard/clinic/statistics', element: <Dashboard /> },
  {
    path: 'search',
    element: (
      <ProtectRoute whenFail={<Warning type="verifyEmail" />} failWhenLogout>
        <Search />
      </ProtectRoute>
    ),
  },
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
