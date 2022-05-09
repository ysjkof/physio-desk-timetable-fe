import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Group as GroupTypes,
  GroupMember,
  useFindMyGroupsQuery,
  User,
} from "../../graphql/generated/graphql";
import { useMe } from "../../hooks/useMe";
import { cls } from "../../libs/utils";
import { Members } from "./members";
import { InviteGroup } from "./invite";
import { InactivateGroup } from "./inactivate";
import { CreateGroup } from "./create";
import { Prescription } from "./prescription";
import { useLocation } from "react-router-dom";
import { InactivatedGroup } from "./inactivated";

type SelectedMenuType =
  | "main"
  | "member"
  | "invite"
  | "create"
  | "inactivate"
  | "inactivated"
  | "prescription";

export interface ModifiedGroupMemberWithUser
  extends Pick<GroupMember, "id" | "staying" | "manager" | "accepted"> {
  user: Pick<User, "id" | "name">;
}
interface ModifiedGroup extends Pick<GroupTypes, "id" | "name" | "activate"> {
  members?: ModifiedGroupMemberWithUser[];
}

export const Dashboard = () => {
  const [selectedGroup, setSelectedGroup] = useState<ModifiedGroup>({
    id: 0,
    name: "나",
    activate: true,
  });
  const [selectedMenu, setSelectedMenu] =
    useState<SelectedMenuType>("prescription");

  const location = useLocation();
  const state = location.state as {
    selectedGroupId: number;
    selectedGroupName: string;
    selectedMenu: Date;
  };

  const { data: meData } = useMe();
  const { data: findMyGroupsData, loading: findGroupLoading } =
    useFindMyGroupsQuery({
      variables: { input: { includeField: "activate" } },
    });

  useEffect(() => {
    if (state) {
      setSelectedGroup({
        id:
          typeof state.selectedGroupId !== "number" ? 0 : state.selectedGroupId,
        name: !state.selectedGroupName ? "나" : state.selectedGroupName,
        activate: true,
      });
    }
  }, [state]);

  const findMyGroupsResults = findMyGroupsData?.findMyGroups.groups;
  console.log("click Selected group", selectedGroup);
  if (findGroupLoading || !meData) {
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
                selectedGroup.id === 0
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
                selectedGroup.id === 0
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
                  setSelectedGroup({ id: 0, name: "나", activate: true });
                }}
              >
                나
              </li>
              {findMyGroupsResults?.map((group) => (
                <li
                  key={group.id}
                  className={cls(
                    selectedGroup.id === group.id
                      ? "rounded-md bg-white font-semibold text-blue-800"
                      : "text-white",
                    "cursor-pointer py-1.5 px-6"
                  )}
                  onClick={() => {
                    setSelectedGroup(group);
                  }}
                >
                  {group.name}
                </li>
              ))}
            </ul>
            <div className="tap-contents px-4">
              {selectedGroup && (
                <>
                  {selectedMenu === "main" && "메뉴를 선택하세요"}
                  {selectedMenu === "member" && (
                    <Members
                      groupId={selectedGroup.id}
                      groupName={selectedGroup.name}
                      members={selectedGroup.members}
                      loggedInUser={meData.me}
                    />
                  )}

                  {selectedMenu === "invite" && (
                    <InviteGroup
                      groupId={selectedGroup.id}
                      groupName={selectedGroup.name}
                    />
                  )}
                  {selectedMenu === "inactivate" && (
                    <InactivateGroup
                      groupId={selectedGroup.id}
                      groupName={selectedGroup.name}
                    />
                  )}
                  {selectedMenu === "prescription" && (
                    <Prescription
                      groupId={selectedGroup.id}
                      groupName={selectedGroup.name}
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
