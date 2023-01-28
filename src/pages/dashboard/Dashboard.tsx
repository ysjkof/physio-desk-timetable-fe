import { ColumnContainer, MenuContainer, Profile } from './components';

const Dashboard = () => {
  return (
    <div>
      <ColumnContainer>
        <Profile />
        <MenuContainer />
      </ColumnContainer>
    </div>
  );
};

export default Dashboard;
