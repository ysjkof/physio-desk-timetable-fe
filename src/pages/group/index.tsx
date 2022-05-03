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

type SelectedMenuType = "main" | "member" | "invite" | "create" | "inactivate";

export interface ModifiedGroupMemberWithUser
  extends Pick<GroupMember, "id" | "staying" | "manager" | "accepted"> {
  user: Pick<User, "id" | "name">;
}
interface ModifiedGroup extends Pick<GroupTypes, "id" | "name" | "activate"> {
  members: ModifiedGroupMemberWithUser[];
}

export const Group = () => {
  const [selectedGroup, setSelectedGroup] = useState<ModifiedGroup>();
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenuType>("member");
  const { data: meData } = useMe();
  const { data: findMyGroupsData, loading: findGroupLoading } =
    useFindMyGroupsQuery({
      variables: { input: { includeField: "activate" } },
    });

  useEffect(() => {
    setSelectedGroup(
      findMyGroupsData?.findMyGroups?.groups
        ? findMyGroupsData?.findMyGroups?.groups[0]
        : undefined
    );
  }, [findMyGroupsData]);

  const findMyGroupsResults = findMyGroupsData?.findMyGroups.groups;

  if (findGroupLoading || !meData) {
    return <></>;
  }
  return (
    <>
      <Helmet>
        <title>그룹| Muool</title>
      </Helmet>
      <div className="container mx-auto flex h-full">
        <nav className="w-[250px] max-w-xs space-y-4">
          <h1 className="border-b text-lg font-semibold">메뉴</h1>
          <ul>
            <li
              className={cls(
                "cursor-pointer font-medium hover:bg-blue-200",
                selectedMenu === "member" ? "bg-blue-100" : ""
              )}
              onClick={() => setSelectedMenu("member")}
            >
              구성원
            </li>
            <li
              className={cls(
                "cursor-pointer font-medium hover:bg-blue-200",
                selectedMenu === "invite" ? "bg-blue-100" : ""
              )}
              onClick={() => setSelectedMenu("invite")}
            >
              초대
            </li>
            <li
              className={cls(
                "cursor-pointer font-medium hover:bg-blue-200",
                selectedMenu === "inactivate" ? "bg-blue-100" : ""
              )}
              onClick={() => setSelectedMenu("inactivate")}
            >
              비활성
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

          <section className="col-start-1 row-start-1 space-y-4 px-4">
            {selectedGroup ? (
              <div className="space-y-2">
                <div>
                  <ul className="tap-list mb-4 flex rounded-md bg-blue-400/90 p-1">
                    {findMyGroupsResults?.map((group) => (
                      <li
                        key={group.id}
                        className={cls(
                          selectedGroup?.id === group.id
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
                  <div className="tap-contents">
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
                  </div>
                </div>
              </div>
            ) : (
              <p>
                소속된 그룹이 없습니다. 그룹을 만들거나 그룹에 초대받으세요.
              </p>
            )}
            {selectedMenu === "create" && <CreateGroup />}
          </section>
        </main>
      </div>
    </>
  );
};
