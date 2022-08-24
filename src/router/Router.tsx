import { useReactiveVar } from '@apollo/client';
import { isLoggedInVar } from '../apollo';
import LoginRoute from './LoginRoute';
import LogoutRoute from './LogoutRoute';

function Router() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  return isLoggedIn ? <LoginRoute /> : <LogoutRoute />;
}

export default Router;
