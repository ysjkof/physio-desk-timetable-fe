import { gql, useLazyQuery } from "@apollo/client";
import { faFemale, faMale, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getYMD } from "../hooks/handleTimeFormat";
import {
  searchPatientByName,
  searchPatientByNameVariables,
  searchPatientByName_searchPatientByName_patients,
} from "../__generated__/searchPatientByName";

const SEARCH_PATIENT_BY_NAME = gql`
  query searchPatientByName($input: SearchPatientInput!) {
    searchPatientByName(input: $input) {
      error
      ok
      totalPages
      totalCount
      patients {
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

  console.log("⚠️ :", patients);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-sm rounded-lg border p-4"
    >
      <label htmlFor="input-patient">환자검색</label>
      <div className="relative mb-4 flex items-center">
        <input
          {...register("patientName", { required: "환자 이름을 입력하세요" })}
          type="text"
          placeholder="환자 검색"
          className="input"
          autoFocus
          id="input-patient"
        />
        <input id="icon-search" type="submit" value={""} />
        <label
          htmlFor="icon-search"
          className="absolute right-0 mr-4 cursor-pointer"
        >
          <FontAwesomeIcon icon={faSearch} className="text-xl" />
        </label>
      </div>
      <div className="border p-4">
        {searchPatientResult
          ? searchPatientResult.searchPatientByName.patients?.map(
              (patient, index) => (
                <div
                  key={index}
                  className="flex items-baseline justify-between"
                >
                  <div className="flex gap-2 ">
                    <span>
                      {patient.gender === "male" ? (
                        <FontAwesomeIcon
                          icon={faMale}
                          className=" text-blue-500 group-hover:text-white"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faFemale}
                          className="text-pink-500 group-hover:text-white"
                        />
                      )}
                    </span>
                    <span className="dark:text-light-blue-100 text-sm font-medium text-blue-600">
                      {patient.name}
                    </span>
                  </div>
                  {patient.registrationNumber ? (
                    <span className="dark:text-light-blue-100 text-xs text-blue-600">
                      R : {patient.registrationNumber}
                    </span>
                  ) : (
                    <span className="dark:text-light-blue-100 text-xs text-blue-600">
                      B : {getYMD(patient.birthday, "yymmdd")}
                    </span>
                  )}
                </div>
              )
            )
          : ""}
      </div>
    </form>
  );
};
