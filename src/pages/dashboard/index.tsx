import { Helmet } from 'react-helmet-async';
import { MeQuery } from '../../graphql/generated/graphql';
import { useMe } from '../../hooks/useMe';
import { Outlet, useLocation } from 'react-router-dom';
import { DashboardTemplate } from './template/DashboardTemplate';
import { DashboardSideNav } from './organisms/DashboardSideNav';
import { DashboardTitle } from './components/DashboardTitle';
import { Loading } from '../../components/atoms/Loading';
import useStore from '../../hooks/useStore';
import { renameUseSplit } from '../../utils/utils';
import { DashboardEndpoint } from '../../router/routes';

export function checkManager(clinicId: number, meData: MeQuery) {
  return Boolean(
    meData.me.members?.find(
      (member) => member.clinic.id === clinicId && member.manager
    )
  );
}
export function checkStay(clinicId: number, meData: MeQuery) {
  return Boolean(
    meData.me.members?.find(
      (member) =>
        member.clinic.id === clinicId && member.accepted && member.staying
    )
  );
}

export const Dashboard = () => {
  const { data: meData, loading } = useMe();
  const { selectedInfo, setSelectedInfo } = useStore();
  const location = useLocation();
  const pathname = location.pathname.split('/');
  const endpoint = pathname[pathname.length - 1] as DashboardEndpoint;

  if (!meData || !selectedInfo.clinic || loading) return <Loading />;

  return (
    <>
      <Helmet>
        <title>대시보드| Muool</title>
      </Helmet>

      <DashboardTemplate
        nav={<DashboardSideNav meData={meData} endpoint={endpoint} />}
        breadcrumb={
          <DashboardTitle
            clinicName={renameUseSplit(selectedInfo.clinic.name)}
            endpoint={endpoint}
          />
        }
      >
        <Outlet />
      </DashboardTemplate>
    </>
  );
};
