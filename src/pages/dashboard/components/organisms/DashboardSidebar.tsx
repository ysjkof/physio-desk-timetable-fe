import {
  clinicMenu,
  DashboardEndpoint,
  personalMenu,
} from '../../../../router/routes';
import Sidebar from '../../../../components/molecules/Sidebar';

interface DashboardSidebarProps {
  endpoint: DashboardEndpoint;
  isAccepted: boolean | undefined;
}

export default function DashboardSidebar({
  endpoint,
  isAccepted,
}: DashboardSidebarProps) {
  return (
    <nav className="dashboard-side-nav h-full">
      <Sidebar disable={!isAccepted}>
        <Sidebar.Ul title="병원">
          {clinicMenu.map((menu, idx) => (
            <Sidebar.Li
              key={idx}
              to={menu.route}
              selected={endpoint === menu.route}
            >
              {menu.name}
            </Sidebar.Li>
          ))}
        </Sidebar.Ul>

        <Sidebar.Ul title="개인">
          {personalMenu.map((menu, idx) => (
            <Sidebar.Li
              key={idx}
              to={menu.route}
              selected={endpoint === menu.route}
            >
              {menu.name}
            </Sidebar.Li>
          ))}
        </Sidebar.Ul>
      </Sidebar>
    </nav>
  );
}
