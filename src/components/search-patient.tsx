import { useReactiveVar } from "@apollo/client";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchPatientByNameLazyQuery } from "../graphql/generated/graphql";
import { cls } from "../libs/utils";
import { selectedPatientVar } from "../libs/variables";
import { NameTag } from "./name-tag";

interface ISearchPatient {}

export const SearchPatient: React.FC<ISearchPatient> = () => {
  const { register, getValues, handleSubmit } = useForm({
    mode: "onChange",
  });
  const selectedPatient = useReactiveVar(selectedPatientVar);

  const [callQuery, { loading, data: searchPatientResult }] =
    useSearchPatientByNameLazyQuery();
  const onSubmit = () => {
    console.log("submit");
    if (!loading) {
      const { patientName } = getValues();
      const patientNameTrim = patientName.trim();
      callQuery({
        variables: {
          input: {
            page: 1,
            query: patientNameTrim,
          },
        },
      });
    }
  };

  useEffect(() => {
    if (!loading && searchPatientResult) {
      setPatients(searchPatientResult.searchPatientByName.patients);
      console.log(searchPatientResult.searchPatientByName.patients);
    }
  }, [loading, searchPatientResult]);

  const [patients, setPatients] = useState<
    | {
        __typename?: "Patient" | undefined;
        id: number;
        name: string;
        gender: string;
        registrationNumber?: string | null | undefined;
        birthday?: any;
      }[]
    | null
  >();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg  pt-4">
      <div className="relative flex items-center rounded-full shadow-sm">
        <input
          {...register("patientName", {
            required: "환자 이름을 입력하세요",
          })}
          id="patientName"
          required
          type="text"
          placeholder="환자 검색"
          className="input rounded-full py-1"
          autoComplete="off"
          autoFocus
          onFocus={() => selectedPatientVar(null)}
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
      <div
        className={cls(
          "mt-4 h-28 overflow-y-scroll rounded-md border border-gray-300 p-1",
          selectedPatient ? "border-none" : ""
        )}
      >
        {!selectedPatient &&
          patients &&
          patients.map((patient, index) => (
            <div className="hover:ring-2 hover:ring-blue-500">
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
          <p className="text-center text-sm text-gray-500">
            환자 목록
            <br />
            검색하면 나타납니다
          </p>
        )}
        {!selectedPatient && patients?.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            검색결과가 없습니다.
          </p>
        )}
        {selectedPatient && (
          <div className="flex h-full px-4">
            <div className="my-auto flex h-4/6 w-full items-center justify-between rounded-md border border-blue-400 px-2 shadow-cst">
              <NameTag
                id={selectedPatient.id}
                gender={selectedPatient.gender}
                name={selectedPatient.name}
                registrationNumber={selectedPatient.registrationNumber}
                birthday={selectedPatient.birthday}
              />
              <button
                className="rounded-lg border bg-white py-1 px-3 shadow-sm hover:bg-gray-600 hover:text-white"
                onClick={() => selectedPatientVar(null)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
