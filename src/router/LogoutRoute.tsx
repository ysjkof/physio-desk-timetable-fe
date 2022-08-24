import { Route, Routes } from 'react-router-dom';
import { GlobalLayout } from '../components/templates/GlobalLayout';
import { Account } from '../pages/auth';
import { Login } from '../pages/auth/Login';
import { SignUp } from '../pages/auth/SignUp';
import { LoginRouteProps } from './LoginRoute';
import { ENDPOINT } from './routes';

function LogoutRoute({ CommonRoute }: LoginRouteProps) {
  return (
    <Routes>
      <Route path="/" element={<GlobalLayout />}>
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
        {CommonRoute}
      </Route>
    </Routes>
  );
}
export default LogoutRoute;
