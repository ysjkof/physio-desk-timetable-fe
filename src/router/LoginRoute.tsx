import { Navigate, Route, Routes } from 'react-router-dom';
import { useMe } from '../hooks/useMe';
import { ENDPOINT, ROUTES } from './routes';
import { lazy } from 'react';
import ProtectRoute from './ProtectRoute';
import Worning from '../components/atoms/Warning';
import GlobalLayout from '../components/templates/GlobalLayout';

const TimeTable = lazy(() => import('../pages/timetable'));
const Dashboard = lazy(() => import('../pages/dashboard'));
const CreateClinic = lazy(
  () => import('../pages/dashboard/components/organisms/CreateClinic')
);
const InviteClinic = lazy(
  () => import('../pages/dashboard/components/organisms/InviteClinic')
);
const Members = lazy(
  () => import('../pages/dashboard/components/organisms/Members')
);
const MyClinics = lazy(
  () => import('../pages/dashboard/components/organisms/MyClinics')
);
const PrescriptionPage = lazy(
  () => import('../pages/dashboard/components/organisms/PrescriptionPage')
);
const Statistics = lazy(
  () => import('../pages/dashboard/components/organisms/Statistics')
);
const EditProfile = lazy(
  () => import('../pages/dashboard/components/organisms/EditProfile')
);
const Search = lazy(() => import('../pages/search/Search'));

export interface LoginRouteProps {
  CommonRoute: JSX.Element[];
}
function LoginRoute({ CommonRoute }: LoginRouteProps) {
  const { data } = useMe();

  const timetableRoute = [
    {
      protectRoute: false,
      path: ENDPOINT.reserve,
      element: <TimeTable />,
    },
    {
      protectRoute: false,
      path: ENDPOINT.edit_reservation,
      element: <TimeTable />,
    },
    {
      protectRoute: false,
      path: ENDPOINT.create_patient,
      element: <TimeTable />,
    },
  ];
  const dashboardRoute = [
    {
      protectRoute: { protect: false, isPass: null },
      path: ENDPOINT.dashboard.clinics,
      element: <MyClinics />,
    },
    {
      protectRoute: { protect: true, isPass: data?.me.verified },
      path: ENDPOINT.dashboard.create,
      element: <CreateClinic />,
    },
    {
      protectRoute: { protect: true, isPass: data?.me.verified },
      path: ENDPOINT.dashboard.invite,
      element: <InviteClinic />,
    },
    {
      protectRoute: { protect: false, isPass: null },
      path: ENDPOINT.dashboard.member,
      element: <Members />,
    },
    {
      protectRoute: { protect: false, isPass: null },
      path: ENDPOINT.dashboard.prescription,
      element: <PrescriptionPage />,
    },
    {
      protectRoute: { protect: true, isPass: data?.me.verified },
      path: ENDPOINT.dashboard.statistics,
      element: <Statistics />,
    },
    {
      protectRoute: { protect: false, isPass: null },
      path: ENDPOINT.dashboard.edit_profile,
      element: <EditProfile />,
    },
  ];

  return (
    <Routes>
      <Route path="/" element={<GlobalLayout isLoggedIn />}>
        <Route index element={<Navigate to={ROUTES.timetable} />} />,
        <Route path={ROUTES.search} element={<Search />} />
        <Route
          key="TimetableRoute"
          path={ROUTES.timetable}
          element={
            <ProtectRoute
              failElement={<Worning type="verifyEmail" />}
              isPass={data?.me.verified}
            >
              <TimeTable />
            </ProtectRoute>
          }
        >
          {timetableRoute.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route
          key="DashboardRoute"
          path={ROUTES.dashboard}
          element={<Dashboard />}
        >
          <Route index element={<Worning type="selectMenu" />} />
          {dashboardRoute.map((route) => {
            const element = route.protectRoute.protect ? (
              <ProtectRoute
                failElement={<Worning type="verifyEmail" />}
                isPass={!!route.protectRoute.isPass}
              >
                {route.element}
              </ProtectRoute>
            ) : (
              route.element
            );

            return (
              <Route key={route.path} path={route.path} element={element} />
            );
          })}
        </Route>
        {CommonRoute}
      </Route>
    </Routes>
  );
}
export default LoginRoute;
