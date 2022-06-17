import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ClinicType, MeQuery } from "../../graphql/generated/graphql";
import { ModifiedLoggedInUser, useMe } from "../../hooks/useMe";
import { Members } from "./organisms/members";
import { InviteClinic } from "./organisms/invite";
import { InactivateClinic } from "./organisms/inactivate";
import { CreateClinic } from "./organisms/create";
import { PrescriptionPage } from "./organisms/prescription";
import { useLocation } from "react-router-dom";
import { InactivatedClinic } from "./organisms/inactivated";
import { Statistics } from "./organisms/statistics";
import { DashboardTemplate } from "./dashboard-template";
import { DashboardSideNav } from "./organisms/nav-side";
import { DashboardTitle } from "./components/title";
import { IMemberWithActivate, selectedClinicVar } from "../../store";
import { useReactiveVar } from "@apollo/client";
import { Loading } from "../../components/atoms/loading";

export type SelectedMenuType =
  | "main"
  | "member"
  | "invite"
  | "create"
  | "inactivate"
  | "inactivated"
  | "prescription"
  | "statistics";

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
    useState<SelectedMenuType>("prescription");
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

    if (
      selectedClinic.id === 0 &&
      (selectedMenu === "member" ||
        selectedMenu === "invite" ||
        selectedMenu === "inactivate")
    ) {
      // 나를 선택했을때
      setSelectedMenu("prescription");
    } else {
      // 병원을 선택했을때
      if (!selectedClinic.isStayed) {
        // 초대를 받아 isActivate는 true지만 아직 수락을 누르지 않아 isStayed는 false
        setSelectedMenu("member");
      } else {
        // 초대 받고 수락을 눌러 isActivate와 isStayed가 true
        if (
          !selectedClinic.isManager &&
          (selectedMenu === "invite" || selectedMenu === "inactivate")
        ) {
          setSelectedMenu("member");
        }
      }
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
                {selectedMenu === "main" && "메뉴를 선택하세요"}
                {selectedMenu === "member" && (
                  <Members loggedInUser={meData.me} />
                )}
                {selectedMenu === "invite" && (
                  <InviteClinic loggedInUser={meData.me} />
                )}
                {selectedMenu === "inactivate" && (
                  <InactivateClinic loggedInUser={meData.me} />
                )}
                {selectedMenu === "prescription" && (
                  <PrescriptionPage loggedInUser={meData.me} />
                )}
                {selectedMenu === "statistics" && (
                  <Statistics loggedInUser={meData.me} />
                )}
              </>
            )}
            {selectedMenu === "create" && <CreateClinic />}
            {selectedMenu === "inactivated" && <InactivatedClinic />}
          </>
        }
      />
    </>
  ) : (
    <Loading />
  );
};
