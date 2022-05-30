import { useReactiveVar } from "@apollo/client";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchPatientByNameLazyQuery } from "../../graphql/generated/graphql";
import { cls } from "../../libs/utils";
import { selectedClinic, selectedPatientVar } from "../../store";
import { NameTag } from "../../components/name-tag";

interface SearchPatientProps {
  selectedClinic: typeof selectedClinic;
}

export const SearchPatient = ({ selectedClinic }: SearchPatientProps) => {
  const { register, getValues, handleSubmit } = useForm({
    mode: "onChange",
  });
  const [queryPageNumber, setQueryPageNumber] = useState(1);
  const selectedPatient = useReactiveVar(selectedPatientVar);

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
            clinicId: selectedClinic?.id,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg pt-4">
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
          "mt-4 h-32 overflow-y-scroll rounded-md border px-1 py-0.5",
          selectedPatient ? "border-none" : ""
        )}
      >
        {!selectedPatient &&
          searchPatientResult?.searchPatientByName.patients?.map(
            (patient, index) => (
              <div key={index} className="hover:ring-2 hover:ring-blue-500">
                <NameTag
                  id={patient.id}
                  gender={patient.gender}
                  name={patient.name}
                  registrationNumber={patient.registrationNumber}
                  birthday={patient.birthday}
                  canClick
                  clinicName={patient.clinic?.name ?? ""}
                  user={patient.users[patient.users.length - 1]}
                />
              </div>
            )
          )}
        {!selectedPatient && !searchPatientResult ? (
          <p className="text-center ">
            환자 목록
            <br />
            검색하면 나타납니다
          </p>
        ) : (
          searchPatientResult?.searchPatientByName.patients?.length === 0 && (
            <p className="text-center ">검색결과가 없습니다.</p>
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
                clinicName={selectedPatient.clinicName}
              />
              <button
                className="rounded-lg border bg-white py-1 px-3 shadow-sm hover:text-white"
                onClick={() => selectedPatientVar(null)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-1 h-1 space-x-4 text-center">
        {searchPatientResult
          ? pageNumbers(
              searchPatientResult.searchPatientByName.totalPages ?? 0
            ).map((pageNumber) => (
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
