import { useReactiveVar } from '@apollo/client';
import { Route, Routes } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { GlobalLayout } from '../components/templates/GlobalLayout';
import { Dashboard } from '../pages/dashboard';
import { Home } from '../pages/home';
import { TimeTable } from '../pages/timetable';
import { NotFound } from '../components/404';
import { Account } from '../pages/auth';
import { Search } from '../pages/search';
import { ConfirmEmail } from '../pages/confirm-email';
import { EditProfile } from '../pages/edit-profile';
import { Login } from '../pages/auth/login';
import { TestPage } from '../components/TestPage';
import { SignUp } from '../pages/auth/signUp';
import { ROUTER } from './routerConstants';

function Router() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  return (
    <Routes>
      <Route path="/" element={<GlobalLayout />}>
        <Route index element={<Home />} />
        {isLoggedIn ? (
          <>
            <Route path={ROUTER.CONFIRM_EMAIL} element={<ConfirmEmail />} />
            <Route path={ROUTER.EDIT_PROFILE} element={<EditProfile />} />
            <Route path={ROUTER.TIMETABLE} element={<TimeTable />}>
              <Route path={ROUTER.ENDPOINT.RESERVE} element={<TimeTable />} />
              <Route path={ROUTER.ENDPOINT.EDIT} element={<TimeTable />} />
              <Route
                path={ROUTER.ENDPOINT.CREATE_PATIENT}
                element={<TimeTable />}
              />
            </Route>
            <Route path={ROUTER.SEARCH} element={<Search />} />
            <Route path={ROUTER.DASHBOARD} element={<Dashboard />} />
            <Route path="test" element={<TestPage />} />
          </>
        ) : (
          <>
            <Route path={ROUTER.AUTH} element={<Account />}>
              <Route path={ROUTER.ENDPOINT.LOGIN} element={<Login />} />
              <Route path={ROUTER.ENDPOINT.SIGN_UP} element={<SignUp />} />
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
