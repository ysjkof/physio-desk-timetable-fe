import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Clinic,
  Member,
  useFindMyClinicsQuery,
  User,
} from "../../graphql/generated/graphql";
import { ModifiedLoggedInUser, useMe } from "../../hooks/useMe";
import { cls } from "../../libs/utils";
import { Members } from "./members";
import { InviteClinic } from "./invite";
import { InactivateClinic } from "./inactivate";
import { CreateClinic } from "./create";
import { PrescriptionPage } from "./prescription";
import { useLocation } from "react-router-dom";
import { InactivatedClinic } from "./inactivated";
import { Statistics } from "./statistics";

type SelectedMenuType =
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
interface ModifiedClinic extends Pick<Clinic, "id" | "name" | "isActivated"> {
  members?: ModifiedClinicMemberWithUser[];
  isManager: boolean;
  isStayed: boolean;
}

export interface InDashboardPageProps
  extends Pick<
    ModifiedClinic,
    "id" | "name" | "members" | "isManager" | "isStayed"
  > {
  loggedInUser: ModifiedLoggedInUser;
}

export const Dashboard = () => {
  const selectedMe = {
    id: 0,
    name: "나",
    isManager: true,
    isActivated: true,
    isStayed: true,
  };
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
  const { data: findMyClinics, loading: findClinicLoading } =
    useFindMyClinicsQuery({
      variables: { input: { includeInactivate: true } },
    });

  function checkIsManager(clinicId: number) {
    return Boolean(
      meData?.me.members?.find(
        (member) => member.clinic.id === clinicId && member.manager
      )
    );
  }
  function getIsStayed(clinicId: number) {
    return Boolean(
      meData?.me.members?.find(
        (member) =>
          member.clinic.id === clinicId && member.accepted && member.staying
      )
    );
  }

  useEffect(() => {
    if (state) {
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
          isManager: checkIsManager(state.selectedClinicId),
          isStayed: getIsStayed(state.selectedClinicId),
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

  const ref = useRef<HTMLUListElement>(null);
  const headerElement = document.getElementById("header");
  const containerHeight = window.innerHeight - headerElement?.offsetHeight!;
  const dashboardContentsHeight = containerHeight - ref.current?.offsetHeight!;
  if (!meData || typeof dashboardContentsHeight !== "number") return <></>;
  return (
    <>
      <Helmet>
        <title>대시보드| Muool</title>
      </Helmet>
      <div
        className="grid grid-cols-[150px,1fr] grid-rows-[3rem,1fr] px-3"
        style={{ ...(containerHeight && { height: containerHeight }) }}
      >
        <nav className="dashboard-side-nav space-y-4">
          <h1 className="border-b font-semibold">메뉴</h1>
          <ul>
            <li
              className={cls(
                "cursor-pointer font-medium hover:bg-blue-200",
                selectedMenu === "member" ? "bg-blue-100" : "",
                selectedClinic.id === 0
                  ? "pointer-events-none font-normal "
                  : ""
              )}
              onClick={() => setSelectedMenu("member")}
            >
              구성원
            </li>
            <li
              className={cls(
                "cursor-pointer font-medium hover:bg-blue-200",
                selectedMenu === "invite" ? "bg-blue-100" : "",
                selectedClinic.isManager === false || selectedClinic.id === 0
                  ? "pointer-events-none font-normal "
                  : ""
              )}
              onClick={() => setSelectedMenu("invite")}
            >
              초대
            </li>
            <li
              className={cls(
                "cursor-pointer font-medium hover:bg-blue-200",
                selectedMenu === "inactivate" ? "bg-blue-100" : "",
                selectedClinic.isManager === false || selectedClinic.id === 0
                  ? "pointer-events-none font-normal "
                  : ""
              )}
              onClick={() => setSelectedMenu("inactivate")}
            >
              비활성
            </li>
            <div className="seperate-bar" />
            <li
              className={cls(
                "cursor-pointer font-medium hover:bg-blue-200",
                selectedMenu === "prescription" ? "bg-blue-100" : ""
              )}
              onClick={() => setSelectedMenu("prescription")}
            >
              처방관리
            </li>
            <li
              className={cls(
                "cursor-pointer font-medium hover:bg-blue-200",
                selectedMenu === "statistics" ? "bg-blue-100" : ""
              )}
              onClick={() => setSelectedMenu("statistics")}
            >
              통계
            </li>
            <div className="seperate-bar" />
            <li
              className={cls(
                "cursor-pointer font-medium hover:bg-blue-200",
                selectedMenu === "create" ? "bg-blue-100" : ""
              )}
              onClick={() => setSelectedMenu("create")}
            >
              그룹 만들기
            </li>
            <li
              className={cls(
                "cursor-pointer font-medium hover:bg-blue-200",
                selectedMenu === "inactivated" ? "bg-blue-100" : ""
              )}
              onClick={() => setSelectedMenu("inactivated")}
            >
              비활성 보기
            </li>
          </ul>
        </nav>
        <nav className="dashboard-top-nav col-start-2">
          <ul
            className="flex h-full items-center bg-blue-400/90 px-2"
            ref={ref}
          >
            <li
              className={cls(
                selectedClinic.id === 0
                  ? "rounded-md bg-white font-semibold text-blue-800"
                  : "text-white",
                "cursor-pointer py-1.5 px-6"
              )}
              onClick={() => {
                setSelectedClinic(selectedMe);
              }}
            >
              나
            </li>
            {findMyClinics?.findMyClinics.clinics?.map((clinic) => (
              <li
                key={clinic.id}
                className={cls(
                  "relative cursor-pointer py-1.5 px-6",
                  selectedClinic.id === clinic.id
                    ? "rounded-md bg-white font-bold text-blue-800"
                    : "text-white",
                  clinic.members.find(
                    (member) =>
                      member.user.id === meData.me.id &&
                      !member.accepted &&
                      !member.staying
                  )
                    ? "after: opacity-90 after:ml-0.5 after:rounded-full after:bg-white after:px-2 after:content-['!']"
                    : ""
                )}
                onClick={() => {
                  setSelectedClinic({
                    ...clinic,
                    isManager: checkIsManager(clinic.id),
                    isStayed: getIsStayed(clinic.id),
                  });
                }}
              >
                {clinic.name}
              </li>
            ))}
          </ul>
        </nav>
        <div
          className="dashboard-contents col-start-2 row-start-2 overflow-y-scroll"
          style={{
            ...(dashboardContentsHeight && { height: dashboardContentsHeight }),
          }}
        >
          {selectedClinic && (
            <>
              {selectedMenu === "main" && "메뉴를 선택하세요"}
              {selectedMenu === "member" && (
                <Members
                  id={selectedClinic.id}
                  name={selectedClinic.name}
                  members={selectedClinic.members}
                  loggedInUser={meData.me}
                  isStayed={selectedClinic.isStayed}
                  isManager={selectedClinic.isManager}
                />
              )}
              {selectedMenu === "invite" && (
                <InviteClinic
                  id={selectedClinic.id}
                  name={selectedClinic.name}
                  members={selectedClinic.members}
                  loggedInUser={meData.me}
                  isStayed={selectedClinic.isStayed}
                  isManager={selectedClinic.isManager}
                />
              )}
              {selectedMenu === "inactivate" && (
                <InactivateClinic
                  id={selectedClinic.id}
                  name={selectedClinic.name}
                  members={selectedClinic.members}
                  loggedInUser={meData.me}
                  isStayed={selectedClinic.isStayed}
                  isManager={selectedClinic.isManager}
                />
              )}
              {selectedMenu === "prescription" && (
                <PrescriptionPage
                  id={selectedClinic.id}
                  name={selectedClinic.name}
                  members={selectedClinic.members}
                  loggedInUser={meData.me}
                  isStayed={selectedClinic.isStayed}
                  isManager={selectedClinic.isManager}
                />
              )}
              {selectedMenu === "statistics" && (
                <Statistics
                  id={selectedClinic.id}
                  name={selectedClinic.name}
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
        </div>
      </div>
    </>
  );
};
