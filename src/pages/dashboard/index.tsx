import { lazy } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MeQuery } from '../../graphql/generated/graphql';
import { useMe } from '../../hooks/useMe';
import useStore from '../../hooks/useStore';
import { DashboardEndpoint } from '../../router/routes';
import { renameUseSplit } from '../../utils/utils';
import { MUOOL } from '../../constants/constants';
import AcceptInvitation from './components/organisms/AcceptInvitation';
import DashboardTemplate from './components/template/DashboardTemplate';
import DashboardSideNav from './components/organisms/DashboardSideNav';
import DashboardTitle from './components/molecules/DashboardTitle';
const Loading = lazy(() => import('../../components/atoms/Loading'));

export function checkStay(clinicId: number, meData: MeQuery) {
  return Boolean(
    meData.me.members?.find(
      (member) =>
        member.clinic.id === clinicId && member.accepted && member.staying
    )
  );
}

export default function Dashboard() {
  const { data: meData, loading } = useMe();
  const { selectedInfo } = useStore();
  const location = useLocation();
  const pathname = location.pathname.split('/');
  const endpoint = pathname[pathname.length - 1] as DashboardEndpoint;

  if (!meData || !selectedInfo.clinic || loading) return <Loading />;

  const isAccepted = meData.me.members?.find(
    (member) => member.clinic.id === selectedInfo.clinic?.id
  )?.accepted;

  return (
    <>
      <Helmet>
        <title>대시보드 | {MUOOL}</title>
      </Helmet>

      <DashboardTemplate
        nav={
          <DashboardSideNav
            meData={meData}
            endpoint={endpoint}
            isAccepted={isAccepted}
          />
        }
        breadcrumb={
          <DashboardTitle
            clinicName={renameUseSplit(selectedInfo.clinic.name)}
            endpoint={endpoint}
          />
        }
      >
        {isAccepted ? <Outlet /> : <AcceptInvitation />}
      </DashboardTemplate>
    </>
  );
}
