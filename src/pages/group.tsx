import React, { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../components/button";
import { Input } from "../components/input";
import {
  CreateGroupInput,
  CreateGroupMutation,
  useCreateGroupMutation,
  useFindMyGroupsQuery,
} from "../graphql/generated/graphql";

export const Group = () => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { isValid, errors },
  } = useForm<CreateGroupInput>({ mode: "onChange" });

  const { data, loading: findGroupLoading } = useFindMyGroupsQuery();

  const onCompleted = (data: CreateGroupMutation) => {
    const {
      createGroup: { ok, error },
    } = data;
  };

  const [createGroupMutation, { loading: createGroupLoading }] =
    useCreateGroupMutation({
      onCompleted,
    });

  const onSubmit = () => {
    if (!createGroupLoading) {
      const { name } = getValues();
      createGroupMutation({
        variables: { input: { name } },
      });
    }
  };
  console.log(watch(), "검증", isValid);
  console.log(
    "파인드 그룹 로딩",
    findGroupLoading,
    "// 그룹만들기 로딩",
    createGroupLoading
  );

  return (
    <>
      <Helmet>
        <title>그룹| Muool</title>
      </Helmet>
      <div className="container mx-auto h-full">
        <h1 className="text-2xl font-medium">그룹 목록</h1>
        {data?.findMyGroups.groups?.map((group) => (
          <div
            key={group.id}
            className="flex max-w-xs flex-col items-center rounded-md border"
          >
            <h2 className="text-xl font-medium">{group.name}</h2>
            <div className="space-x-5">
              {group.members.map((member, index) => (
                <Fragment key={index}>
                  <span>{member.accepted ? "승인" : "승인대기"}</span>
                  <span>{member.manager ? "관리자" : ""}</span>
                  <span>{member.staying ? "현재 멤버" : "이전 멤버"}</span>
                </Fragment>
              ))}
            </div>
          </div>
        ))}
        <h1 className="mt-16 text-2xl font-medium">그룹 만들기</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col"
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
      </div>
    </>
  );
};
