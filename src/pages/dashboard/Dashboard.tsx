import { useReactiveVar } from '@apollo/client';
import { clinicListsVar } from '../../store';
import {
  ColumnContainer,
  MemberList,
  MenuContainer,
  Profile,
  SearchAndInviteMember,
} from './components';

const Dashboard = () => {
  useReactiveVar(clinicListsVar); // 리렌더 위한 선언

  return (
    <div className="flex">
      <ColumnContainer>
        <Profile />
        <MenuContainer />
      </ColumnContainer>
      <div className="flex h-full w-[360px] flex-col overflow-y-scroll border-r border-r-table-line pt-16">
        <h1 className="mb-8 pl-4 text-3xl font-medium">직원열람 및 관리</h1>
        <SearchAndInviteMember />
        <MemberList />
      </div>
    </div>
  );
};

export default Dashboard;
