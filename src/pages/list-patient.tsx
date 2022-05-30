import React from "react";
import { Li } from "../components/Li";
import { useFindAllPatientsQuery } from "../graphql/generated/graphql";

export const ListPatient = () => {
  const { data: queryResult, loading } = useFindAllPatientsQuery({
    variables: {
      input: {
        page: 1,
      },
    },
  });
  return (
    <div className="bg-gray-100">
      <div className="container mx-auto flex h-full flex-col items-center justify-center rounded-md  p-3">
        <h1 className="font-bold">List table</h1>

        {queryResult?.findAllPatients.results ? (
          <ul className="w-full  divide-y rounded-lg bg-white shadow-cst">
            <div className="flex justify-between rounded-md bg-gray-50 px-10">
              <span className="w-1/4">이름</span>
              <span className="w-1/4  font-extralight ">성별</span>
              <span className="w-1/4  font-extralight ">생년월일</span>
              <span className="w-1/4  font-extralight ">등록번호</span>
              <span className="w-1/4 text-sky-500" />
            </div>
            {queryResult.findAllPatients.results.map((p) => (
              <Li
                key={p.id}
                id={p.id}
                name={p.name}
                gender={p.gender}
                registrationNumber={p.registrationNumber}
                birthday={p.birthday}
                loading={loading}
              />
            ))}
          </ul>
        ) : (
          ""
        )}
        <span>총 환자 수 : {queryResult?.findAllPatients.totalCount}</span>
        <span>페이지 : {queryResult?.findAllPatients.totalPages}</span>
      </div>
    </div>
  );
};
