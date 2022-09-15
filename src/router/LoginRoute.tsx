import { Navigate, Route, Routes } from 'react-router-dom';
import { Worning } from '../components/atoms/Warning';
import { GlobalLayout } from '../components/templates/GlobalLayout';
import { useMe } from '../hooks/useMe';
import { Dashboard } from '../pages/dashboard';
import { CreateClinic } from '../pages/dashboard/components/organisms/CreateClinic';
import { InviteClinic } from '../pages/dashboard/components/organisms/InviteClinic';
import { Members } from '../pages/dashboard/components/organisms/Members';
import { MyClinics } from '../pages/dashboard/components/organisms/MyClinics';
import { PrescriptionPage } from '../pages/dashboard/components/organisms/PrescriptionPage';
import { Statistics } from '../pages/dashboard/components/organisms/Statistics';
import { EditProfile } from '../pages/dashboard/components/organisms/EditProfile';
import { Search } from '../pages/search';
import { TimeTable } from '../pages/timetable';
import ProtectRoute from './ProtectRoute';
import { ENDPOINT, ROUTES } from './routes';

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
