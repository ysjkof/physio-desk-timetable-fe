import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useFindGroupByIdQuery } from "../graphql/generated/graphql";

export const Group = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm();

  const { data, loading, error } = useFindGroupByIdQuery({
    variables: { input: { groupId: 1 } },
  });

  return (
    <>
      <Helmet>
        <title>그룹| Muool</title>
      </Helmet>
      <div className="container mx-auto h-full">
        <h1 className="text-2xl font-medium">그룹 목록</h1>
        <div className="flex max-w-xs flex-col items-center rounded-md border">
          <h2 className="text-xl font-medium">
            {data?.findGroupById.group?.name}
          </h2>
          <div className="flex flex-col">
            {data?.findGroupById.group?.members.map((member) => (
              <span>{member.member.email}</span>
            ))}
          </div>
        </div>
        <h1 className="mt-16 text-2xl font-medium">그룹 만들기</h1>
      </div>
    </>
  );
};
