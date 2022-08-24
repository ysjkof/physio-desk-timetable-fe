import { Route, Routes } from 'react-router-dom';
import { Worning } from '../components/atoms/Warning';
import { NotFound } from '../components/organisms/404';
import { GlobalLayout } from '../components/templates/GlobalLayout';
import { ConfirmEmail } from '../pages/confirm-email';
import { Dashboard } from '../pages/dashboard';
import { CreateClinic } from '../pages/dashboard/organisms/CreateClinic';
import { InviteClinic } from '../pages/dashboard/organisms/InviteClinic';
import { Members } from '../pages/dashboard/organisms/Members';
import { MyClinics } from '../pages/dashboard/organisms/MyClinics';
import { PrescriptionPage } from '../pages/dashboard/organisms/PrescriptionPage';
import { Statistics } from '../pages/dashboard/organisms/Statistics';
import { EditProfile } from '../pages/edit-profile';
import { Home } from '../pages/home';
import { Search } from '../pages/search';
import { TestPage } from '../pages/TestPage';
import { TimeTable } from '../pages/timetable';
import { ENDPOINT, ROUTES } from './routes';

const timetableRoute = [
  { path: ENDPOINT.reserve, element: <TimeTable /> },
  { path: ENDPOINT.edit, element: <TimeTable /> },
  { path: ENDPOINT.create_patient, element: <TimeTable /> },
];
const dashboardRoute = [
  { path: ENDPOINT.DASHBOARD.clinics, element: <MyClinics /> },
  { path: ENDPOINT.DASHBOARD.create, element: <CreateClinic /> },
  { path: ENDPOINT.DASHBOARD.invite, element: <InviteClinic /> },
  { path: ENDPOINT.DASHBOARD.member, element: <Members /> },
  { path: ENDPOINT.DASHBOARD.prescription, element: <PrescriptionPage /> },
  { path: ENDPOINT.DASHBOARD.statistics, element: <Statistics /> },
];

function LoginRoute() {
  return (
    <Routes>
      <Route path="/" element={<GlobalLayout isLoggedIn />}>
        <Route index element={<Home />} />
        <Route path={ROUTES.confirmEmail} element={<ConfirmEmail />} />
        <Route path={ROUTES.editProfile} element={<EditProfile />} />
        <Route path={ROUTES.search} element={<Search />} />
        <Route
          key="TimetableRoute"
          path={ROUTES.timetable}
          element={<TimeTable />}
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
          {dashboardRoute.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>
      <Route path="test" element={<TestPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default LoginRoute;
