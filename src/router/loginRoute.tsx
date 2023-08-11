import { lazy } from 'react';
import {
  MemberDetail,
  MemberManagement,
  MessagesManagement,
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
import { DASHBOARD, LOGIN, PATIENT_SEARCH, SETTING, TIMETABLE } from './routes';
import { Messages } from '../pages/dashboard/components/MessagesManagement';

const ProtectRoute = lazy(() => import('./ProtectRoute'));

const TimeTable = lazy(() => import('../pages/timetable/Timetable'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Setting = lazy(() => import('../pages/setting/Setting'));

const loginRoute = [
  {
    path: TIMETABLE,
    element: (
      <ProtectRoute whenFail={LOGIN} failWhenLogout>
        <TimeTable />
      </ProtectRoute>
    ),
  },
  {
    path: PATIENT_SEARCH,
    element: <Search />,
  },
  {
    path: DASHBOARD.member.root,
    element: (
      <ProtectRoute whenFail={LOGIN} failWhenLogout>
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
            path: DASHBOARD.member.detail,
            element: <MemberDetail />,
          },
        ],
      },
      {
        path: DASHBOARD.member.invite,
        element: <InviteUser />,
      },
    ],
  },
  {
    path: DASHBOARD.prescriptions.root,
    element: (
      <ProtectRoute whenFail={LOGIN} failWhenLogout>
        <Dashboard />
      </ProtectRoute>
    ),
    children: [
      {
        path: '',
        element: <PrescriptionManagement />,
        children: [
          { path: DASHBOARD.prescriptions.create, element: <></> },
          { path: DASHBOARD.prescriptions.edit, element: <></> },
        ],
      },
    ],
  },
  {
    path: DASHBOARD.statistics.root,
    element: (
      <ProtectRoute whenFail={LOGIN} failWhenLogout>
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
  // {
  //   path: DASHBOARD.messages.root,
  //   element: (
  //     <ProtectRoute whenFail={LOGIN} failWhenLogout>
  //       <Dashboard />
  //     </ProtectRoute>
  //   ),
  //   children: [
  //     {
  //       path: '',
  //       element: <MessagesManagement />,
  //       children: [
  //         { path: '', element: <Messages /> },
  //         { path: DASHBOARD.messages.booking, element: 'booking' },
  //       ],
  //     },
  //   ],
  // },
  {
    path: SETTING.root,
    element: (
      <ProtectRoute whenFail={LOGIN} failWhenLogout>
        <Setting />
      </ProtectRoute>
    ),
    children: [
      {
        path: SETTING.myInfo,
        element: <MyProfile />,
      },
      {
        path: SETTING.myClinics,
        element: <MyClinics />,
      },
      {
        path: SETTING.createClinic,
        element: <CreateClinic />,
      },
    ],
  },
];

export default loginRoute;
