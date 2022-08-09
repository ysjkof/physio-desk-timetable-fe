import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ClinicType, MeQuery } from '../../graphql/generated/graphql';
import { useMe } from '../../hooks/useMe';
import { Members } from './organisms/Members';
import { InviteClinic } from './organisms/InviteClinic';
import { CreateClinic } from './organisms/CreateClinic';
import { PrescriptionPage } from './organisms/PrescriptionPage';
import { useLocation } from 'react-router-dom';
import { MyClinics } from './organisms/MyClinics';
import { Statistics } from './organisms/Statistics';
import { DashboardTemplate } from './DashboardTemplate';
import { DashboardSideNav } from './organisms/DashboardSideNav';
import { DashboardTitle } from './components/DashboardTitle';
import { selectedClinicVar } from '../../store';
import { useReactiveVar } from '@apollo/client';
import { Loading } from '../../components/atoms/Loading';
import { IMemberWithActivate, ModifiedLoggedInUser } from '../../types/type';

export type SelectedMenuType =
  | 'main'
  | 'member'
  | 'invite'
  | 'create'
  | 'clinics'
  | 'prescription'
  | 'statistics';

export interface InDashboardPageProps {
  loggedInUser: ModifiedLoggedInUser;
}

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
  const [selectedMenu, setSelectedMenu] =
    useState<SelectedMenuType>('prescription');
  const location = useLocation();
  const state = location.state as {
    selectedClinicId: number;
    selectedClinicName: string;
    selectedClinicType: ClinicType;
    selectedMenu: SelectedMenuType;
    selectedClinicMembers: IMemberWithActivate[];
  };
  const selectedClinic = useReactiveVar(selectedClinicVar);

  const { data: meData, loading: meLoading } = useMe();

  useEffect(() => {
    if (meData && state) {
      selectedClinicVar({
        id: state.selectedClinicId,
        name: state.selectedClinicName,
        type: state.selectedClinicType,
        isManager: checkManager(state.selectedClinicId, meData),
        isStayed: checkStay(state.selectedClinicId, meData),
        members: state.selectedClinicMembers,
      });
    }
  }, [state, meData]);

  useEffect(() => {
    if (!selectedClinic) return;
    if (!selectedClinic.isStayed) {
      // 초대를 받아 isActivate는 true지만 아직 수락을 누르지 않아 isStayed는 false
      return setSelectedMenu('member');
    }
    if (!selectedClinic.isManager && selectedMenu === 'invite') {
      // 초대 받고 수락을 눌러 isActivate와 isStayed가 true
      return setSelectedMenu('member');
    }
  }, [selectedClinic]);

  return meData && selectedClinic ? (
    <>
      <Helmet>
        <title>대시보드| Muool</title>
      </Helmet>

      <DashboardTemplate
        nav={
          <DashboardSideNav
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            meData={meData}
          />
        }
        breadcrumb={
          <DashboardTitle
            clinicName={selectedClinic.name}
            type={selectedMenu}
          />
        }
        main={
          <>
            {selectedClinic && (
              <>
                {selectedMenu === 'main' && '메뉴를 선택하세요'}
                {selectedMenu === 'member' && (
                  <Members loggedInUser={meData.me} />
                )}
                {selectedMenu === 'invite' && (
                  <InviteClinic loggedInUser={meData.me} />
                )}
                {selectedMenu === 'prescription' && (
                  <PrescriptionPage loggedInUser={meData.me} />
                )}
                {selectedMenu === 'statistics' && (
                  <Statistics loggedInUser={meData.me} />
                )}
              </>
            )}
            {selectedMenu === 'create' && <CreateClinic />}
            {selectedMenu === 'clinics' && (
              <MyClinics loggedInUser={meData.me} />
            )}
          </>
        }
      />
    </>
  ) : (
    <Loading />
  );
};
