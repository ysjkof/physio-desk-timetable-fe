import { faSearch, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../components/button";
import { Input } from "../components/input";
import {
  CreateGroupInput,
  SearchUsersByNameInput,
  useAcceptInvitationMutation,
  useCreateGroupMutation,
  useFindMyGroupsQuery,
  useInviteGroupMutation,
  useSearchUsersByNameLazyQuery,
} from "../graphql/generated/graphql";
import { useMe } from "../hooks/useMe";
import { cls } from "../libs/utils";

type SelectedMenuType = "main" | "member" | "invite" | "create" | "close";

export const Group = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<CreateGroupInput>({ mode: "onChange" });
  const {
    register: registerSearchUsersByName,
    handleSubmit: handleSubmitSearchUsersByName,
    getValues: getValuesSearchUsersByName,
  } = useForm<SearchUsersByNameInput>({ mode: "onChange" });

  const [selectedGroup, setSelectedGroup] = useState<{
    __typename?: "Group" | undefined;
    id: number;
    name: string;
    members: {
      __typename?: "GroupMember" | undefined;
      id: number;
      staying: boolean;
      manager: boolean;
      accepted: boolean;
      user: {
        __typename?: "User" | undefined;
        id: number;
        name: string;
      };
    }[];
  }>();
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenuType>("main");
  const { data: meData } = useMe();
  const { data: findMyGroupsData, loading: findGroupLoading } =
    useFindMyGroupsQuery();

  const [createGroupMutation, { loading: createGroupLoading }] =
    useCreateGroupMutation();

  const onSubmitCreateGroup = () => {
    if (!createGroupLoading) {
      const { name } = getValues();
      createGroupMutation({
        variables: { input: { name } },
      });
    }
  };

  const onSubmitSearchUsersByName = () => {
    if (!searchUserByNameLoading) {
      const { name } = getValuesSearchUsersByName();
      searchUsersByName({
        variables: {
          input: { name },
        },
      });
    }
  };

  const [
    inviteGroupMutation,
    { data: inviteGroupData, loading: inviteGroupLoading },
  ] = useInviteGroupMutation();

  const onClickInviteToGroup = (
    user: {
      id: number;
      name: string;
      email: string;
    },
    groupName: string,
    groupId: number
  ) => {
    if (confirm(`${groupName}에 ${user.name}을(를) 그룹에 초대합니까?`)) {
      inviteGroupMutation({
        variables: { input: { groupId, userIds: [user.id] } },
      });
    }
  };

  const [acceptInvitation, { data: acceptInvitationData }] =
    useAcceptInvitationMutation({
      onCompleted: (data) => {
        console.log("초대수락완료", data);
      },
    });

  useEffect(() => {
    setSelectedGroup(
      findMyGroupsData?.findMyGroups?.groups
        ? findMyGroupsData?.findMyGroups?.groups[0]
        : undefined
    );
  }, [findMyGroupsData]);

  const [
    searchUsersByName,
    { data: searchUsersByNameData, loading: searchUserByNameLoading },
  ] = useSearchUsersByNameLazyQuery();
  const searchUserResults = searchUsersByNameData?.searchUsersByName.results;
  const findMyGroupsResults = findMyGroupsData?.findMyGroups.groups;

  if (findGroupLoading) {
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
              className="cursor-pointer font-medium hover:bg-gray-50"
              onClick={() => setSelectedMenu("member")}
            >
              구성원
            </li>
            <li
              className="cursor-pointer font-medium hover:bg-gray-50"
              onClick={() => setSelectedMenu("invite")}
            >
              초대
            </li>
            <li
              className="cursor-pointer font-medium hover:bg-gray-50"
              onClick={() => setSelectedMenu("close")}
            >
              폐쇄
            </li>
          </ul>
          <div className="seperate-bar" />
          <button
            type="button"
            className="font-medium"
            onClick={() => setSelectedMenu("create")}
          >
            그룹 만들기
          </button>
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

          <section className="col-start-1 row-start-1 space-y-4">
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
                      <ul>
                        {selectedGroup.members.map((member) => (
                          <div
                            key={member.id}
                            className="flex w-full items-center justify-between"
                          >
                            <div>
                              <span className="inline-block w-10 text-xs text-gray-500">
                                {member.manager ? "관리자" : "회원"}
                              </span>
                              <span
                                className={cls(
                                  meData?.me.id === member.user.id
                                    ? "font-bold"
                                    : ""
                                )}
                              >
                                {member.user.name}
                              </span>
                            </div>
                            <div className="flex items-center">
                              {!member.staying && !member.accepted && (
                                <>
                                  {meData?.me.id === member.user.id && (
                                    <button
                                      className="btn-sm mr-4"
                                      type="button"
                                      onClick={() =>
                                        acceptInvitation({
                                          variables: {
                                            input: {
                                              groupId: selectedGroup.id,
                                            },
                                          },
                                        })
                                      }
                                    >
                                      수락하기
                                    </button>
                                  )}
                                  <span className="text-xs text-red-500">
                                    승인대기
                                  </span>
                                </>
                              )}
                              {member.staying && member.accepted && ""}
                              {!member.staying &&
                                member.accepted &&
                                "떠난 회원"}
                            </div>
                          </div>
                        ))}
                      </ul>
                    )}

                    {selectedMenu === "invite" && (
                      <div className="h-full">
                        <div className="border-b">
                          <span className="font-medium">
                            {selectedGroup.name}
                          </span>
                          <span className="text-sm">에 구성원 초대하기</span>
                        </div>
                        <form
                          onSubmit={handleSubmitSearchUsersByName(
                            onSubmitSearchUsersByName
                          )}
                          className="mx-auto max-w-sm pt-4"
                        >
                          <div className="relative flex items-center shadow-sm">
                            <input
                              {...registerSearchUsersByName("name", {
                                required: "Username is required",
                              })}
                              id="search-user"
                              required
                              type="text"
                              placeholder="사용자 검색"
                              className={cls("input py-1")}
                              autoComplete="off"
                            />
                            <label
                              htmlFor="icon-search"
                              className="absolute right-0 mr-4 cursor-pointer"
                            >
                              <input
                                id="icon-search"
                                type="submit"
                                value={""}
                                tabIndex={-1}
                                className="absolute"
                              />
                              <FontAwesomeIcon icon={faSearch} />
                            </label>
                          </div>
                          {/* 할일: 초대하기는 매니저만 가능하게 하기 */}
                        </form>
                        <ul
                          className={cls(
                            "mx-auto flex max-w-md flex-col rounded-md",
                            inviteGroupLoading ? "pointer-events-none" : ""
                          )}
                        >
                          <div className="flex items-center justify-between border-b py-2">
                            <span>이름</span>
                            <span>초대하기</span>
                          </div>
                          {searchUserResults &&
                            searchUserResults.length !== 0 &&
                            searchUserResults.map((user) => (
                              <li
                                key={user.id}
                                className="flex cursor-pointer items-center justify-between border-b px-4 py-2 hover:bg-gray-100"
                                onClick={() =>
                                  onClickInviteToGroup(
                                    user,
                                    selectedGroup.name,
                                    selectedGroup.id
                                  )
                                }
                              >
                                <span>{user.name}</span>
                                <FontAwesomeIcon icon={faUserPlus} />
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                    {selectedMenu === "close" && (
                      <p>모임 폐쇄 기능 준비 중...</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p>
                소속된 그룹이 없습니다. 그룹을 만들거나 그룹에 초대받으세요.
              </p>
            )}
            {selectedMenu === "create" && (
              <form
                onSubmit={handleSubmit(onSubmitCreateGroup)}
                className="mx-auto flex max-w-sm flex-col"
              >
                <Input
                  label={"이름*"}
                  name={"name"}
                  placeholder={"이름을 입력하세요"}
                  register={register("name", {
                    required: "Name is required",
                  })}
                  type={"name"}
                  required={true}
                />
                <Button
                  canClick={isValid}
                  loading={createGroupLoading}
                  actionText={"만들기"}
                />
              </form>
            )}
          </section>
        </main>
      </div>
    </>
  );
};
