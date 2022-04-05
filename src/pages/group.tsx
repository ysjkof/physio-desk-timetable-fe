import React, { Fragment, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../components/button";
import { Input } from "../components/input";
import {
  CreateGroupInput,
  CreateGroupMutation,
  useCreateGroupMutation,
  useFindGroupByIdLazyQuery,
  useFindGroupByIdQuery,
  useFindMyGroupsQuery,
  useInviteGroupMutation,
} from "../graphql/generated/graphql";
import { cls } from "../libs/utils";

export const Group = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<CreateGroupInput>({ mode: "onChange" });
  // const {
  //   register: registerInvite,
  //   handleSubmit: handleSubmitInvite,
  //   getValues: getValuesInvite,
  //   watch: watchInvite,
  //   formState: { isValid: isValidInvite, errors: errorsInvite },
  // } = useForm({ mode: "onChange" });
  const [loading, setLoading] = useState(false);

  const { data: findMyGroupData, loading: findGroupLoading } =
    useFindMyGroupsQuery();

  const [createGroupMutation] = useCreateGroupMutation({
    onCompleted: (data: CreateGroupMutation) => {
      const {
        createGroup: { ok, error },
      } = data;
      if (typeof ok === "boolean") {
        setLoading(false);
      }
    },
  });

  const onSubmit = () => {
    if (!loading) {
      setLoading(true);
      const { name } = getValues();
      createGroupMutation({
        variables: { input: { name } },
      });
    }
  };

  const [inviteGroupMutation, { data }] = useInviteGroupMutation({
    // variables: { input: { groupId: 14, userIds: [2, 3] } },
  });
  const clickInviteGroupMutation = () => {
    console.log("inviteGroupMutation 실행");
    inviteGroupMutation({
      onCompleted: (data) => console.log(data.inviteGroup),
    });
  };

  const { data: findGroupData } = useFindGroupByIdQuery({
    variables: { input: { groupId: 14 } },
  });

  console.log(findGroupData);

  return (
    <>
      <Helmet>
        <title>그룹| Muool</title>
      </Helmet>
      <div className="container mx-auto h-full flex">
        <nav className="max-w-xs w-[250px] space-y-4">
          <h1 className="text-2xl font-medium">그룹 목록</h1>
          <ul>
            {findMyGroupData?.findMyGroups.groups?.map((group) => (
              <li
                key={group.id}
                className="flex justify-between items-center rounded-md border px-4"
              >
                <span
                  className={cls(
                    group.members[0].staying ? "font-medium" : "text-gray-400"
                  )}
                >
                  {group.name}
                </span>
              </li>
            ))}
          </ul>
          <h1 className="text-2xl font-medium">그룹 만들기</h1>
          <ul>
            <li></li>
          </ul>
        </nav>
        <main className="w-full">
          <button
            type="button"
            onClick={clickInviteGroupMutation}
            className="px-4 border rounded-md hover hover:bg-zinc-100"
          >
            초대
          </button>
          <button type="button">탈퇴</button>
          <div className="mb-20 space-y-4">
            {findGroupData?.findGroupById.group?.members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col border rounded-md max-w-xs px-4"
              >
                <span>{member.member.email}</span>
                <span>{member.manager ? "관리자" : ""}</span>
                <span>
                  {member.staying
                    ? "가입"
                    : member.accepted
                    ? "탈퇴"
                    : "승인대기"}
                </span>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex max-w-sm mx-auto flex-col"
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
              loading={loading}
              actionText={"만들기"}
            />
          </form>
        </main>
      </div>
    </>
  );
};
