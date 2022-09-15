import { Outlet } from 'react-router-dom';
import useLoginInitialization from '../../hooks/useLoginInitialization';
import { Loading } from '../atoms/Loading';
import Toast from '../molecules/Toast';
import { LoggedInGlobalNavBar } from '../organisms/LoggedInGlobalNavBar';
import { LoggedOutGlobalNavBar } from '../organisms/LoggedOutGlobalNavBar';

export const GlobalLayout = ({ isLoggedIn }: { isLoggedIn?: boolean }) => {
  let loading = true;
  if (isLoggedIn) {
    loading = useLoginInitialization().loading;
  }

  if (isLoggedIn && loading) return <Loading></Loading>;

  return (
    <div className="h-screen overflow-hidden">
      {isLoggedIn ? <LoggedInGlobalNavBar /> : <LoggedOutGlobalNavBar />}
      <Outlet />
      <Toast />
    </div>
  );
};
