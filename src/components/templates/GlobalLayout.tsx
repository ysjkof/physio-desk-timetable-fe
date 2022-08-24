import { Outlet } from 'react-router-dom';
import { LoggedInGlobalNavigationBar } from '../organisms/LoggedInGlobalNavigationBar';
import { GlobalNavigationBar } from '../organisms/GlobalNavigationBar';

export const GlobalLayout = ({ isLoggedIn }: { isLoggedIn?: boolean }) => {
  return (
    <div className="h-screen overflow-hidden">
      {isLoggedIn ? <LoggedInGlobalNavigationBar /> : <GlobalNavigationBar />}
      <Outlet />
    </div>
  );
};
