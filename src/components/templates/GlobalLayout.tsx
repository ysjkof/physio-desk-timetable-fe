import { Outlet } from 'react-router-dom';
import useLoginInitialization from '../../hooks/useLoginInitialization';
import useWindowSize from '../../hooks/useWindowSize';
import { Loading } from '../atoms/Loading';
import Toast from '../molecules/Toast';
import { LoggedInGlobalNavBar } from '../organisms/LoggedInGlobalNavBar';
import { LoggedOutGlobalNavBar } from '../organisms/LoggedOutGlobalNavBar';

export const GlobalLayout = ({ isLoggedIn }: { isLoggedIn?: boolean }) => {
  let loading = true;
  if (isLoggedIn) {
    loading = useLoginInitialization().loading;
  }

  const { height } = useWindowSize(true);

  if (isLoggedIn && loading) return <Loading></Loading>;

  return (
    <div className="h-screen overflow-hidden">
      {isLoggedIn ? <LoggedInGlobalNavBar /> : <LoggedOutGlobalNavBar />}
      <div style={{ height: height + 'px' }}>
        <Outlet />
      </div>
      <Toast />
    </div>
  );
};
