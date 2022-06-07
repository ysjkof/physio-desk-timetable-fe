import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Clinic, Member, MeQuery, User } from "../../graphql/generated/graphql";
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
import { selectedClinicVar, selecteMe } from "../../store";
import { useReactiveVar } from "@apollo/client";

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
export interface ModifiedClinic extends Pick<Clinic, "id" | "name"> {
  members?: ModifiedClinicMemberWithUser[];
  isManager: boolean;
  isStayed: boolean;
}

export interface InDashboardPageProps {
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

export const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] =
    useState<SelectedMenuType>("prescription");
  const location = useLocation();
  const state = location.state as {
    selectedClinicId: number;
    selectedClinicName: string;
    selectedMenu: SelectedMenuType;
  };
  const selectedClinic = useReactiveVar(selectedClinicVar);

  const { data: meData, loading: meLoading } = useMe();

  useEffect(() => {
    if (meData && state) {
      if (
        state.selectedClinicId === undefined &&
        state.selectedClinicName === undefined
      ) {
        selectedClinicVar(selecteMe);
      } else {
        selectedClinicVar({
          id: state.selectedClinicId,
          name: state.selectedClinicName,
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
  );
};
