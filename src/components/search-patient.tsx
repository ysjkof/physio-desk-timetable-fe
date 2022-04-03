import { useReactiveVar } from "@apollo/client";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CreatePatientInput,
  useSearchPatientByNameLazyQuery,
} from "../graphql/generated/graphql";
import { cls } from "../libs/utils";
import { selectedPatientVar } from "../libs/variables";
import { NameTag } from "./name-tag";

interface ISearchPatient {}

export const SearchPatient: React.FC<ISearchPatient> = () => {
  const { register, getValues, handleSubmit } = useForm({
    mode: "onChange",
  });
  const [queryPageNumber, setQueryPageNumber] = useState(1);
  const selectedPatient = useReactiveVar(selectedPatientVar);
  const [totalCount, setTotalCount] = useState<number | null | undefined>();
  const [totalPages, setTotalPages] = useState<number | null | undefined>();
  const [patients, setPatients] = useState<CreatePatientInput[] | null>();

  const [callQuery, { loading, data: searchPatientResult }] =
    useSearchPatientByNameLazyQuery();
  const onSubmit = () => {
    if (!loading) {
      const { patientName } = getValues();
      const patientNameTrim = patientName.trim();
      callQuery({
        variables: {
          input: {
            page: queryPageNumber,
            query: patientNameTrim,
          },
        },
      });
    }
  };
  const pageNumbers = (total: number): number[] => {
    let arr = [];
    for (let i = 0; i < total; i++) {
      arr.push(i);
      if (i > 100) break;
    }
    return arr;
  };

  useEffect(() => {
    if (!loading && searchPatientResult) {
      setPatients(searchPatientResult.searchPatientByName.patients);
      setTotalCount(searchPatientResult.searchPatientByName.totalCount);
      setTotalPages(searchPatientResult.searchPatientByName.totalPages);
    }
  }, [loading, searchPatientResult]);

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
          "mt-4 h-32 overflow-y-scroll rounded-md border border-gray-300 px-1 py-0.5",
          selectedPatient ? "border-none" : ""
        )}
      >
        {!selectedPatient &&
          patients &&
          patients.map((patient, index) => (
            <div key={index} className="hover:ring-2 hover:ring-blue-500">
              <NameTag
                id={patient.id}
                gender={patient.gender}
                name={patient.name}
                registrationNumber={patient.registrationNumber}
                birthday={patient.birthday}
                canClick
              />
            </div>
          ))}
        {!selectedPatient && !patients ? (
          <p className="text-center text-sm text-gray-500">
            환자 목록
            <br />
            검색하면 나타납니다
          </p>
        ) : (
          patients?.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              검색결과가 없습니다.
            </p>
          )
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
      <div className="mt-1 h-1 space-x-4 text-center text-xs text-gray-600">
        {totalPages
          ? pageNumbers(totalPages).map((pageNumber) => (
              <button
                key={pageNumber}
                className={cls(
                  queryPageNumber === pageNumber + 1
                    ? "font-bold text-red-500"
                    : ""
                )}
                onClick={() => setQueryPageNumber(pageNumber + 1)}
              >
                {pageNumber + 1}
              </button>
            ))
          : ""}
      </div>
    </form>
  );
};
