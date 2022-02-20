import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Li } from "../components/Li";
import {
  findAllPatientsQuery,
  findAllPatientsQueryVariables,
} from "../__generated__/findAllPatientsQuery";

const FIND_ALL_PATIENTS_QUERY = gql`
  query findAllPatientsQuery($input: FindAllPatientsInput!) {
    findAllPatients(input: $input) {
      ok
      error
      totalPages
      totalCount
      results {
        id
        name
        gender
        registrationNumber
        birthday
      }
    }
  }
`;

export const ListPatient = () => {
  console.time("시작");
  const {
    data: queryResult,
    loading,
    error,
  } = useQuery<findAllPatientsQuery, findAllPatientsQueryVariables>(
    FIND_ALL_PATIENTS_QUERY,
    {
      variables: {
        input: {
          page: 1,
        },
      },
    }
  );
  console.timeEnd("시작");
  return (
    <div className="bg-gray-100">
      {console.time("렌더")}
      <div className="container mx-auto flex h-full flex-col items-center justify-center rounded-md  p-3">
        <h1 className="text-3xl font-bold">List table</h1>

        {queryResult?.findAllPatients.results ? (
          <ul className="shadow-cst  w-full divide-y rounded-lg bg-white">
            <div className="flex justify-between rounded-md bg-gray-50 px-10">
              <span className="w-1/4">이름</span>
              <span className=" w-1/4 text-sm font-extralight text-gray-400">
                성별
              </span>
              <span className="w-1/4 text-sm font-extralight text-gray-400">
                생년월일
              </span>
              <span className="w-1/4 text-sm font-extralight text-gray-400">
                등록번호
              </span>
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
      {console.timeEnd("렌더")}
    </div>
  );
};
