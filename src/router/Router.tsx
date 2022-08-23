import { useReactiveVar } from '@apollo/client';
import { Route, Routes } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { GlobalLayout } from '../components/templates/GlobalLayout';
import { Dashboard } from '../pages/dashboard';
import { Home } from '../pages/home';
import { TimeTable } from '../pages/timetable';
import { NotFound } from '../components/organisms/404';
import { Account } from '../pages/auth';
import { Search } from '../pages/search';
import { ConfirmEmail } from '../pages/confirm-email';
import { EditProfile } from '../pages/edit-profile';
import { Login } from '../pages/auth/login';
import { TestPage } from '../pages/TestPage';
import { SignUp } from '../pages/auth/signUp';
import { ENDPOINT, ROUTER } from './routerConstants';
import { MyClinics } from '../pages/dashboard/organisms/MyClinics';
import { CreateClinic } from '../pages/dashboard/organisms/CreateClinic';
import { InviteClinic } from '../pages/dashboard/organisms/InviteClinic';
import { Members } from '../pages/dashboard/organisms/Members';
import { PrescriptionPage } from '../pages/dashboard/organisms/PrescriptionPage';
import { Statistics } from '../pages/dashboard/organisms/Statistics';

function Router() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  return (
    <Routes>
      <Route path="/" element={<GlobalLayout />}>
        <Route index element={<Home />} />
        {isLoggedIn ? (
          <>
            <Route path={ROUTER.confirm_email} element={<ConfirmEmail />} />
            <Route path={ROUTER.edit_profile} element={<EditProfile />} />
            <Route path={ROUTER.timetable} element={<TimeTable />}>
              <Route path={ENDPOINT.reserve} element={<TimeTable />} />
              <Route path={ENDPOINT.edit} element={<TimeTable />} />
              <Route path={ENDPOINT.create_patient} element={<TimeTable />} />
            </Route>
            <Route path={ROUTER.search} element={<Search />} />
            <Route path={ROUTER.dashboard} element={<Dashboard />}>
              <Route index element={'메뉴를 선택하세요'} />
              <Route
                path={ENDPOINT.DASHBOARD.clinics}
                element={<MyClinics />}
              />
              <Route
                path={ENDPOINT.DASHBOARD.create}
                element={<CreateClinic />}
              />
              <Route
                path={ENDPOINT.DASHBOARD.invite}
                element={<InviteClinic />}
              />
              <Route path={ENDPOINT.DASHBOARD.member} element={<Members />} />
              <Route
                path={ENDPOINT.DASHBOARD.prescription}
                element={<PrescriptionPage />}
              />
              <Route
                path={ENDPOINT.DASHBOARD.statistics}
                element={<Statistics />}
              />
            </Route>
            <Route path="test" element={<TestPage />} />
          </>
        ) : (
          <>
            <Route path={ROUTER.auth} element={<Account />}>
              <Route path={ENDPOINT.login} element={<Login />} />
              <Route path={ENDPOINT.sign_up} element={<SignUp />} />
            </Route>
          </>
        )}
        <Route path="/about" element={<h1>hghh</h1>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default Router;
