import { Route, Routes } from 'react-router-dom';
import { NotFound } from '../components/organisms/404';
import { GlobalLayout } from '../components/templates/GlobalLayout';
import { Account } from '../pages/auth';
import { Login } from '../pages/auth/Login';
import { SignUp } from '../pages/auth/SignUp';
import { Home } from '../pages/home';
import { TestPage } from '../pages/TestPage';
import { ENDPOINT } from './routes';

function LogoutRoute() {
  return (
    <Routes>
      <Route path="/" element={<GlobalLayout />}>
        <Route index element={<Home />} />
        <Route
          path={ENDPOINT.login}
          element={
            <Account>
              <Login />
            </Account>
          }
        />
        <Route
          path={ENDPOINT.signUp}
          element={
            <Account>
              <SignUp />
            </Account>
          }
        />
      </Route>
      <Route path="test" element={<TestPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default LogoutRoute;
