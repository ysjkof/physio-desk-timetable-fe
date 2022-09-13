import { GlobalNavigationBarLayout } from '../molecules/GlobalNavigationBarLayout';
import LoggedOutGlobalNavBarMenu from '../molecules/LoggedOutGlobalNavBarMenu';

export const LoggedOutGlobalNavBar = () => {
  return (
    <GlobalNavigationBarLayout>
      <LoggedOutGlobalNavBarMenu />
    </GlobalNavigationBarLayout>
  );
};
