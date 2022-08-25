import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Worning } from '../components/atoms/Warning';
import { GlobalLayout } from '../components/templates/GlobalLayout';
import { useMe } from '../hooks/useMe';
import { Dashboard } from '../pages/dashboard';
import { CreateClinic } from '../pages/dashboard/organisms/CreateClinic';
import { InviteClinic } from '../pages/dashboard/organisms/InviteClinic';
import { Members } from '../pages/dashboard/organisms/Members';
import { MyClinics } from '../pages/dashboard/organisms/MyClinics';
import { PrescriptionPage } from '../pages/dashboard/organisms/PrescriptionPage';
import { Statistics } from '../pages/dashboard/organisms/Statistics';
import { EditProfile } from '../pages/auth/EditProfile';
import { Search } from '../pages/search';
import { TimeTable } from '../pages/timetable';
import { loggedInUserVar } from '../store';
import ProtectRoute from './ProtectRoute';
import { ENDPOINT, ROUTES } from './routes';

export interface LoginRouteProps {
  CommonRoute: JSX.Element[];
}
function LoginRoute({ CommonRoute }: LoginRouteProps) {
  const { data } = useMe();

  useEffect(() => {
    if (data) {
      loggedInUserVar(data.me);
      return;
    }
    return () => {
      loggedInUserVar(undefined);
    };
  }, [data]);

  const timetableRoute = [
    {
      protectRoute: false,
      path: ENDPOINT.reserve,
      element: <TimeTable />,
    },
    {
      protectRoute: false,
      path: ENDPOINT.editReservation,
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
      path: ENDPOINT.DASHBOARD.clinics,
      element: <MyClinics />,
    },
    {
      protectRoute: { protect: true, isPass: data?.me.verified },
      path: ENDPOINT.DASHBOARD.create,
      element: <CreateClinic />,
    },
    {
      protectRoute: { protect: true, isPass: data?.me.verified },
      path: ENDPOINT.DASHBOARD.invite,
      element: <InviteClinic />,
    },
    {
      protectRoute: { protect: false, isPass: null },
      path: ENDPOINT.DASHBOARD.member,
      element: <Members />,
    },
    {
      protectRoute: { protect: false, isPass: null },
      path: ENDPOINT.DASHBOARD.prescription,
      element: <PrescriptionPage />,
    },
    {
      protectRoute: { protect: true, isPass: data?.me.verified },
      path: ENDPOINT.DASHBOARD.statistics,
      element: <Statistics />,
    },
  ];

  return (
    <Routes>
      <Route path="/" element={<GlobalLayout isLoggedIn />}>
        <Route path={ROUTES.editProfile} element={<EditProfile />} />
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
