import { Outlet } from 'react-router-dom';
import { GlobalNavigationBar } from '../organisms/GlobalNavigationBar';

export const GlobalLayout = () => {
  return (
    <div className="h-screen overflow-hidden">
      <GlobalNavigationBar />
      <Outlet />
    </div>
  );
};
