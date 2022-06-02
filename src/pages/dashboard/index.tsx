import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Clinic, Member, MeQuery, User } from "../../graphql/generated/graphql";
import { ModifiedLoggedInUser, useMe } from "../../hooks/useMe";
import { cls } from "../../libs/utils";
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
import { DashboardTopNav } from "./organisms/nav-top";
import { DashboardTitle } from "./components/title";

export type SelectedMenuType =
  | "main"
  | "member"
  | "invite"
  | "create"
  | "inactivate"
  | "inactivated"
  | "prescription"
  | "statistics";

export interface ModifiedClinicMemberWithUser
  extends Pick<Member, "id" | "staying" | "manager" | "accepted"> {
  user: Pick<User, "id" | "name">;
}
export interface ModifiedClinic
  extends Pick<Clinic, "id" | "name" | "isActivated"> {
  members?: ModifiedClinicMemberWithUser[];
  isManager: boolean;
  isStayed: boolean;
}

export interface InDashboardPageProps
  extends Pick<ModifiedClinic, "members" | "isManager" | "isStayed"> {
  clinicId: number;
  clinicName: string;
  loggedInUser: ModifiedLoggedInUser;
}

export function checkIsManager(clinicId: number, meData: MeQuery) {
  return Boolean(
    meData.me.members?.find(
      (member) => member.clinic.id === clinicId && member.manager
    )
  );
}
export function getIsStayed(clinicId: number, meData: MeQuery) {
  return Boolean(
    meData.me.members?.find(
      (member) =>
        member.clinic.id === clinicId && member.accepted && member.staying
    )
  );
}
export const selectedMe = {
  id: 0,
  name: "개인",
  isManager: true,
  isActivated: true,
  isStayed: true,
};

export const Dashboard = () => {
  const [selectedClinic, setSelectedClinic] =
    useState<ModifiedClinic>(selectedMe);
  const [selectedMenu, setSelectedMenu] =
    useState<SelectedMenuType>("prescription");
  const location = useLocation();
  const state = location.state as {
    selectedClinicId: number;
    selectedClinicName: string;
    selectedMenu: SelectedMenuType;
  };

  const { data: meData, loading: meLoading } = useMe();

  useEffect(() => {
    if (meData && state) {
      if (
        state.selectedClinicId === undefined &&
        state.selectedClinicName === undefined
      ) {
        setSelectedClinic(selectedMe);
      } else {
        setSelectedClinic({
          id: state.selectedClinicId,
          name: state.selectedClinicName,
          isActivated: true,
          isManager: checkIsManager(state.selectedClinicId, meData),
          isStayed: getIsStayed(state.selectedClinicId, meData),
        });
      }
    }
  }, [state, meData]);
  useEffect(() => {
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

  if (!meData) return <></>;
  return (
    <>
      <Helmet>
        <title>대시보드| Muool</title>
      </Helmet>

      <DashboardTemplate
        nav={
          <DashboardSideNav
            selectedClinic={selectedClinic}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            setSelectedClinic={setSelectedClinic}
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
                  <Members
                    clinicId={selectedClinic.id}
                    clinicName={selectedClinic.name}
                    members={selectedClinic.members}
                    loggedInUser={meData.me}
                    isStayed={selectedClinic.isStayed}
                    isManager={selectedClinic.isManager}
                  />
                )}
                {selectedMenu === "invite" && (
                  <InviteClinic
                    clinicId={selectedClinic.id}
                    clinicName={selectedClinic.name}
                    members={selectedClinic.members}
                    loggedInUser={meData.me}
                    isStayed={selectedClinic.isStayed}
                    isManager={selectedClinic.isManager}
                  />
                )}
                {selectedMenu === "inactivate" && (
                  <InactivateClinic
                    clinicId={selectedClinic.id}
                    clinicName={selectedClinic.name}
                    members={selectedClinic.members}
                    loggedInUser={meData.me}
                    isStayed={selectedClinic.isStayed}
                    isManager={selectedClinic.isManager}
                  />
                )}
                {selectedMenu === "prescription" && (
                  <PrescriptionPage
                    clinicId={selectedClinic.id}
                    clinicName={selectedClinic.name}
                    members={selectedClinic.members}
                    loggedInUser={meData.me}
                    isStayed={selectedClinic.isStayed}
                    isManager={selectedClinic.isManager}
                  />
                )}
                {selectedMenu === "statistics" && (
                  <Statistics
                    clinicId={selectedClinic.id}
                    clinicName={selectedClinic.name}
                    members={selectedClinic.members}
                    loggedInUser={meData.me}
                    isStayed={selectedClinic.isStayed}
                    isManager={selectedClinic.isManager}
                  />
                )}
              </>
            )}
            {selectedMenu === "create" && <CreateClinic />}
            {selectedMenu === "inactivated" && <InactivatedClinic />}
          </>
        }
      />
    </>
  );
};
