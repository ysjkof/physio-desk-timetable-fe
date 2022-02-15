import { gql, useLazyQuery, useReactiveVar } from "@apollo/client";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { cls } from "../libs/utils";
import { selectedPatientVar } from "../libs/variables";
import {
  searchPatientByName,
  searchPatientByNameVariables,
  searchPatientByName_searchPatientByName_patients,
} from "../__generated__/searchPatientByName";
import { NameTag } from "./name-tag";

const SEARCH_PATIENT_BY_NAME = gql`
  query searchPatientByName($input: SearchPatientInput!) {
    searchPatientByName(input: $input) {
      error
      ok
      totalPages
      totalCount
      patients {
        id
        name
        gender
        registrationNumber
        birthday
      }
    }
  }
`;

interface ISearchPatient {}

export const SearchPatient: React.FC<ISearchPatient> = () => {
  const { register, getValues, handleSubmit } = useForm({ mode: "onChange" });
  const selectedPatient = useReactiveVar(selectedPatientVar);
  const [callQuery, { loading, data: searchPatientResult }] = useLazyQuery<
    searchPatientByName,
    searchPatientByNameVariables
  >(SEARCH_PATIENT_BY_NAME);

  const onSubmit = () => {
    if (!loading) {
      const { patientName } = getValues();
      callQuery({
        variables: {
          input: {
            page: 1,
            query: patientName,
          },
        },
      });
    }
  };

  useEffect(() => {
    if (!loading && searchPatientResult) {
      setPatients(searchPatientResult?.searchPatientByName.patients);
    }
  }, [loading, searchPatientResult]);

  const [patients, setPatients] = useState<
    searchPatientByName_searchPatientByName_patients[] | null
  >();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg  pt-4">
      <div className="relative flex items-center">
        <input
          {...register("patientName", { required: "환자 이름을 입력하세요" })}
          type="text"
          placeholder="환자 검색"
          className="input"
          autoFocus
          id="input-patient"
          onFocus={() => selectedPatientVar(null)}
        />
        <label
          htmlFor="icon-search"
          className="absolute right-0 mr-4 cursor-pointer"
        >
          <input
            id="icon-search"
            type="submit"
            value={" "}
            tabIndex={-1}
            className="absolute"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>
      <div
        className={cls(
          "mt-4 h-28  border overflow-y-scroll p-1",
          selectedPatient ? "border-none" : ""
        )}
      >
        {!selectedPatient &&
          patients &&
          patients.map((patient, index) => (
            <div className="hover:ring-blue-500 hover:ring-2">
              <NameTag
                key={index}
                id={patient.id}
                gender={patient.gender}
                name={patient.name}
                registrationNumber={patient.registrationNumber}
                birthday={patient.birthday}
                canClick
              />
            </div>
          ))}
        {!selectedPatient && !patients && (
          <p className="text-sm text-gray-500 text-center">
            환자 목록
            <br />
            검색하면 나타납니다
          </p>
        )}
        {selectedPatient && (
          <div className="flex h-full px-4">
            <div className="flex items-center my-auto h-4/6 shadow-cst rounded-md px-2 w-full border border-blue-400">
              <NameTag
                id={selectedPatient.id}
                gender={selectedPatient.gender}
                name={selectedPatient.name}
                registrationNumber={selectedPatient.registrationNumber}
                birthday={selectedPatient.birthday}
              />
              <button
                className="hover:bg-gray-600 hover:text-white rounded-lg border p-1 shadow-sm bg-white"
                onClick={() => selectedPatientVar(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
