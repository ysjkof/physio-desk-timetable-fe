import { lazy } from 'react';
import { ROUTES } from './routes';
import {
  MemberDetail,
  MemberManagement,
  NotSelected,
  PrescriptionManagement,
  Statistics,
} from '../pages/dashboard/components';
import Setting from '../pages/setting/Setting';
import {
  CreateClinic,
  MyClinics,
  MyProfile,
} from '../pages/setting/components';

const ProtectRoute = lazy(() => import('./ProtectRoute'));
const TimeTable = lazy(() => import('../pages/timetable/Timetable'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Search = lazy(() => import('../pages/search/Search'));
const Warning = lazy(() => import('../components/Warning'));

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
        element: (
          <ProtectRoute
            whenFail={<Warning type="verifyEmail" />}
            failWhenLogout
          >
            <CreateClinic />,
          </ProtectRoute>
        ),
      },
    ],
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
          {
            path: 'invite',
            element: <div>초대하기</div>,
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
  {
    path: 'dashboard/clinic/statistics',
    element: <Dashboard />,
    children: [
      {
        path: '',
        element: (
          <ProtectRoute
            whenFail={<Warning type="verifyEmail" />}
            failWhenLogout
          >
            <Statistics />,
          </ProtectRoute>
        ),
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
  // {
  //   path: invite,
  //   element: (
  //     <ProtectRoute whenFail={<Warning type="verifyEmail" />} failWhenLogout>
  //       <InviteClinic />
  //     </ProtectRoute>
  //   ),
  // },
];

export default loginRoute;
