import { lazy } from 'react';
import {
  MemberDetail,
  MemberManagement,
  NotSelected,
  PrescriptionManagement,
  Statistics,
} from '../pages/dashboard/components';
import InviteUser from '../pages/dashboard/components/MemberManagement/InviteUser';
import {
  CreateClinic,
  MyClinics,
  MyProfile,
} from '../pages/setting/components';
import Search from '../pages/search/Search';

const ProtectRoute = lazy(() => import('./ProtectRoute'));
const Warning = lazy(() => import('../components/Warning'));

const TimeTable = lazy(() => import('../pages/timetable/Timetable'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Setting = lazy(() => import('../pages/setting/Setting'));

const loginRoute = [
  {
    path: 'tt',
    element: (
      <ProtectRoute whenFail="/login" failWhenLogout>
        <TimeTable />
      </ProtectRoute>
    ),
  },
  {
    path: 'dashboard/clinic/members',
    element: (
      <ProtectRoute whenFail="/login" failWhenLogout>
        <Dashboard />
      </ProtectRoute>
    ),
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
          {
            path: 'invite',
            element: <InviteUser />,
          },
        ],
      },
    ],
  },
  {
    path: 'dashboard/clinic/prescriptions',
    element: (
      <ProtectRoute whenFail="/login" failWhenLogout>
        <Dashboard />
      </ProtectRoute>
    ),
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
  {
    path: 'dashboard/clinic/statistics',
    element: (
      <ProtectRoute whenFail="/login" failWhenLogout>
        <Dashboard />
      </ProtectRoute>
    ),
    children: [
      {
        path: '',
        element: <Statistics />,
      },
    ],
  },
  {
    path: 'setting',
    element: (
      <ProtectRoute whenFail="/" failWhenLogout>
        <Setting />
      </ProtectRoute>
    ),
    children: [
      {
        path: 'my-info',
        element: <MyProfile />,
      },
      {
        path: 'my-clinics',
        element: <MyClinics />,
      },
      {
        path: 'clinic/create',
        element: <CreateClinic />,
      },
    ],
  },
  {
    path: 'search',
    element: (
      <ProtectRoute whenFail={<Warning type="verifyEmail" />} failWhenLogout>
        <Search />
      </ProtectRoute>
    ),
  },
];

export default loginRoute;
