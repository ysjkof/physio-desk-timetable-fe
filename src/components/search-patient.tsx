import { gql, useLazyQuery } from "@apollo/client";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  searchPatientByName,
  searchPatientByNameVariables,
  searchPatientByName_searchPatientByName_patients,
} from "../__generated__/searchPatientByName";
import { NameTagSearch } from "./name-tag-search";

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-sm rounded-lg border px-4 pt-4"
    >
      <div className="relative flex items-center">
        <input
          {...register("patientName", { required: "환자 이름을 입력하세요" })}
          type="text"
          placeholder="환자 검색"
          className="input"
          autoFocus
          id="input-patient"
        />
        <input id="icon-search" type="submit" value={" "} tabIndex={-1} />
        <label
          htmlFor="icon-search"
          className="absolute right-0 mr-4 cursor-pointer"
        >
          <FontAwesomeIcon icon={faSearch} className="text-xl" />
        </label>
      </div>
      <div className="mt-4">
        {patients?.map((patient, index) => (
          <NameTagSearch
            key={index}
            id={patient.id}
            gender={patient.gender}
            name={patient.name}
            registrationNumber={patient.registrationNumber}
            birthday={patient.birthday}
            canClick
          />
        ))}
      </div>
    </form>
  );
};
