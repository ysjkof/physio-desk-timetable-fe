import { useReactiveVar } from '@apollo/client';
import { clinicListsVar } from '../../store';
import {
  MemberList,
  MenuContainer,
  Profile,
  SearchAndInviteMember,
} from './components';

const Dashboard = () => {
  useReactiveVar(clinicListsVar); // 리렌더 위한 선언

  return (
    <div className="flex">
      <div className="css_dashboard__column-container-1st">
        <Profile />
        <MenuContainer />
      </div>
      <div className="css_dashboard__column-container-2nd">
        <h1 className="mb-8 pl-4 text-3xl font-medium">직원열람 및 관리</h1>
        <SearchAndInviteMember />
        <MemberList />
      </div>
    </div>
  );
};

export default Dashboard;
