import { lazy, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useMe } from '../../hooks/useMe';
import useStore from '../../hooks/useStore';
import { DashboardEndpoint } from '../../router/routes';
import { MUOOL } from '../../constants/constants';
import AcceptInvitation from './components/organisms/AcceptInvitation';
import DashboardTemplate from './components/template/DashboardTemplate';
import DashboardSidebar from './components/organisms/DashboardSidebar';
import DashboardTitle from './components/molecules/DashboardTitle';
import DashboardClinicSelector from './components/organisms/DashboardClinicSelector';
import { MeQuery } from '../../models/generated.models';

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
  const endpoint = pathname[2] as DashboardEndpoint;

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
        clinicSelector={
          <DashboardClinicSelector meData={meData} isAccepted={isAccepted} />
        }
        breadcrumb={<DashboardTitle endpoint={endpoint} />}
        sidebar={
          <DashboardSidebar endpoint={endpoint} isAccepted={isAccepted} />
        }
      >
        {isAccepted ? (
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        ) : (
          <AcceptInvitation />
        )}
      </DashboardTemplate>
    </>
  );
}
