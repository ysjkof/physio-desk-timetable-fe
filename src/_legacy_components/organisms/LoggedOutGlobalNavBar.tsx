import GlobalNavigationBarLayout from '../templates/GlobalNavigationBarLayout';
import LoggedOutGlobalNavBarMenu from '../molecules/LoggedOutGlobalNavBarMenu';

export default function LoggedOutGlobalNavBar() {
  return (
    <GlobalNavigationBarLayout>
      <LoggedOutGlobalNavBarMenu />
    </GlobalNavigationBarLayout>
  );
}
