import { useReactiveVar } from '@apollo/client';
import { Outlet } from 'react-router-dom';
import { clinicListsVar } from '../../store';
import { MenuContainer, Profile } from './components';
import { useWindowSize } from '../../hooks';

const Dashboard = () => {
  useReactiveVar(clinicListsVar); // 리렌더 위한 선언
  const { width } = useWindowSize(true);

  return (
    <div className="flex text-base" style={{ width }}>
      <div className="css_dashboard__column-container">
        <Profile />
        <MenuContainer />
      </div>
      <Outlet />
    </div>
  );
};

export default Dashboard;
