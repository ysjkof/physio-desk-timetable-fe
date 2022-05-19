import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Group as GroupTypes,
  GroupMember,
  useFindMyGroupsQuery,
  User,
} from "../../graphql/generated/graphql";
import { ModifiedLoggedInUser, useMe } from "../../hooks/useMe";
import { cls } from "../../libs/utils";
import { Members } from "./members";
import { InviteGroup } from "./invite";
import { InactivateGroup } from "./inactivate";
import { CreateGroup } from "./create";
import { PrescriptionPage } from "./prescription";
import { useLocation } from "react-router-dom";
import { InactivatedGroup } from "./inactivated";
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

export interface ModifiedGroupMemberWithUser
  extends Pick<GroupMember, "id" | "staying" | "manager" | "accepted"> {
  user: Pick<User, "id" | "name">;
}
interface ModifiedGroup extends Pick<GroupTypes, "id" | "name" | "activate"> {
  members?: ModifiedGroupMemberWithUser[];
  isManager: boolean;
  isStayed: boolean;
}

export interface InDashboardPageProps
  extends Pick<
    ModifiedGroup,
    "id" | "name" | "members" | "isManager" | "isStayed"
  > {
  loggedInUser: ModifiedLoggedInUser;
}

export const Dashboard = () => {
  const selectedMe = {
    id: 0,
    name: "나",
    isManager: true,
    activate: true,
    isStayed: true,
  };
  const [selectedGroup, setSelectedGroup] = useState<ModifiedGroup>(selectedMe);
  const [selectedMenu, setSelectedMenu] =
    useState<SelectedMenuType>("prescription");
  const location = useLocation();
  const state = location.state as {
    selectedGroupId: number;
    selectedGroupName: string;
    selectedMenu: SelectedMenuType;
  };

  const { data: meData, loading: meLoading } = useMe();
  const { data: findMyGroupsData, loading: findGroupLoading } =
    useFindMyGroupsQuery({
      variables: { input: { includeField: "activate" } },
    });

  function checkIsManager(groupId: number) {
    return Boolean(
      meData?.me.groups?.find(
        (member) => member.group.id === groupId && member.manager
      )
    );
  }
  function getIsStayed(groupId: number) {
    return Boolean(
      meData?.me.groups?.find(
        (member) =>
          member.group.id === groupId && member.accepted && member.staying
      )
    );
  }

  useEffect(() => {
    if (state) {
      if (
        state.selectedGroupId === undefined &&
        state.selectedGroupName === undefined
      ) {
        setSelectedGroup(selectedMe);
      } else {
        setSelectedGroup({
          id: state.selectedGroupId,
          name: state.selectedGroupName,
          activate: true,
          isManager: checkIsManager(state.selectedGroupId),
          isStayed: getIsStayed(state.selectedGroupId),
        });
      }
    }
  }, [state, meData]);
  useEffect(() => {
    if (
      selectedGroup.id === 0 &&
      (selectedMenu === "member" ||
        selectedMenu === "invite" ||
        selectedMenu === "inactivate")
    ) {
      setSelectedMenu("prescription");
    } else {
      if (
        !selectedGroup.isManager &&
        (selectedMenu === "invite" || selectedMenu === "inactivate")
      ) {
        setSelectedMenu("member");
      }
    }
  }, [selectedGroup]);

  const findMyGroupsResults = findMyGroupsData?.findMyGroups.groups;

  if (meLoading || findGroupLoading || !meData || !findMyGroupsData) {
    return <></>;
  }
  return (
    <>
      <Helmet>
        <title>대시보드| Muool</title>
      </Helmet>
      <div className="container mx-auto flex h-full">
        <nav className="w-[250px] space-y-4">
          <h1 className="border-b text-lg font-semibold">메뉴</h1>
          <ul>
            <li
              className={cls(
                "cursor-pointer font-medium hover:bg-blue-200",
                selectedMenu === "member" ? "bg-blue-100" : "",
                selectedGroup.id === 0
                  ? "pointer-events-none font-normal text-gray-400"
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
                selectedGroup.isManager === false || selectedGroup.id === 0
                  ? "pointer-events-none font-normal text-gray-400"
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
                selectedGroup.isManager === false || selectedGroup.id === 0
                  ? "pointer-events-none font-normal text-gray-400"
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
        <main className="grid w-full grid-cols-[1fr_150px]">
          <aside className="col-start-2 flex flex-col gap-4">
            <button type="button" className="btn-sm">
              aside menu
            </button>
            <button type="button" className="btn-sm">
              aside menu2
            </button>
          </aside>

          <section className="col-start-1 row-start-1 space-y-4 bg-gray-50">
            <ul className="tap-list mb-4 flex rounded-md bg-blue-400/90 p-1">
              <li
                className={cls(
                  selectedGroup.id === 0
                    ? "rounded-md bg-white font-semibold text-blue-800"
                    : "text-white",
                  "cursor-pointer py-1.5 px-6"
                )}
                onClick={() => {
                  setSelectedGroup(selectedMe);
                }}
              >
                나
              </li>
              {findMyGroupsResults?.map((group) => (
                <li
                  key={group.id}
                  className={cls(
                    "relative cursor-pointer py-1.5 px-6",
                    selectedGroup.id === group.id
                      ? "rounded-md bg-white font-bold text-blue-800"
                      : "text-white",
                    group.members.find(
                      (member) =>
                        member.user.id === meData.me.id &&
                        !member.accepted &&
                        !member.staying
                    )
                      ? "opacity-90 after:ml-0.5 after:rounded-full after:bg-white after:px-2 after:text-gray-800 after:content-['!']"
                      : ""
                  )}
                  onClick={() => {
                    setSelectedGroup({
                      ...group,
                      isManager: checkIsManager(group.id),
                      isStayed: getIsStayed(group.id),
                    });
                  }}
                >
                  {group.name}
                </li>
              ))}
            </ul>
            <div className="contents px-4">
              {selectedGroup && (
                <>
                  {selectedMenu === "main" && "메뉴를 선택하세요"}
                  {selectedMenu === "member" && (
                    <Members
                      id={selectedGroup.id}
                      name={selectedGroup.name}
                      members={selectedGroup.members}
                      loggedInUser={meData.me}
                      isStayed={selectedGroup.isStayed}
                      isManager={selectedGroup.isManager}
                    />
                  )}

                  {selectedMenu === "invite" && (
                    <InviteGroup
                      id={selectedGroup.id}
                      name={selectedGroup.name}
                      members={selectedGroup.members}
                      loggedInUser={meData.me}
                      isStayed={selectedGroup.isStayed}
                      isManager={selectedGroup.isManager}
                    />
                  )}
                  {selectedMenu === "inactivate" && (
                    <InactivateGroup
                      id={selectedGroup.id}
                      name={selectedGroup.name}
                      members={selectedGroup.members}
                      loggedInUser={meData.me}
                      isStayed={selectedGroup.isStayed}
                      isManager={selectedGroup.isManager}
                    />
                  )}
                  {selectedMenu === "prescription" && (
                    <PrescriptionPage
                      id={selectedGroup.id}
                      name={selectedGroup.name}
                      members={selectedGroup.members}
                      loggedInUser={meData.me}
                      isStayed={selectedGroup.isStayed}
                      isManager={selectedGroup.isManager}
                    />
                  )}
                  {selectedMenu === "statistics" && (
                    <Statistics
                      id={selectedGroup.id}
                      name={selectedGroup.name}
                      members={selectedGroup.members}
                      loggedInUser={meData.me}
                      isStayed={selectedGroup.isStayed}
                      isManager={selectedGroup.isManager}
                    />
                  )}
                </>
              )}
              {selectedMenu === "create" && <CreateGroup />}
              {selectedMenu === "inactivated" && <InactivatedGroup />}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};
