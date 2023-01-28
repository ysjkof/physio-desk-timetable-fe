import { DASHBOARD_MENU_KR } from '../../../../constants/constants';
import { DashboardEndpoint } from '../../../../router/routes';

interface DashboardTitleProps {
  endpoint: DashboardEndpoint;
}

export default function DashboardTitle({ endpoint }: DashboardTitleProps) {
  return (
    <h2 className="bg-white">
      <span>{DASHBOARD_MENU_KR[endpoint]}</span>
    </h2>
  );
}
