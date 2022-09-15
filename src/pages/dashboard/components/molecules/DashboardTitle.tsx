import { DASHBOARD_MENU_KR } from '../../../../constants/constants';
import { DashboardEndpoint } from '../../../../router/routes';

interface DashboardTitleProps {
  clinicName: string;
  endpoint: DashboardEndpoint;
}

export default function DashboardTitle({
  clinicName,
  endpoint,
}: DashboardTitleProps) {
  return (
    <h2 className="bg-white">
      <span>
        {clinicName} &gt; {DASHBOARD_MENU_KR[endpoint]}
      </span>
    </h2>
  );
}
