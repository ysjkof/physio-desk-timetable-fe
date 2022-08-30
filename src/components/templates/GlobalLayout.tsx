import { Outlet } from 'react-router-dom';
import { LoggedInGlobalNavigationBar } from '../organisms/LoggedInGlobalNavigationBar';
import { GlobalNavigationBar } from '../organisms/GlobalNavigationBar';
import useLoginInitialization from '../../hooks/useLoginInitialization';
import { Loading } from '../atoms/Loading';
import Toast from '../molecules/Toast';

export const GlobalLayout = ({ isLoggedIn }: { isLoggedIn?: boolean }) => {
  const { loading } = useLoginInitialization();

  if (isLoggedIn && loading) return <Loading></Loading>;
  return (
    <div className="h-screen overflow-hidden">
      {isLoggedIn ? <LoggedInGlobalNavigationBar /> : <GlobalNavigationBar />}
      <Outlet />
      <Toast />
    </div>
  );
};
