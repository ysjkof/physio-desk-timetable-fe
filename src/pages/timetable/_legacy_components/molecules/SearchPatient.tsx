import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import NameTag from './NameTag';
import Warning from '../../../../_legacy_components/atoms/Warning';
import MenuButton from '../../../../_legacy_components/molecules/MenuButton';
import { cls } from '../../../../utils/common.utils';
import { ClinicsOfClient } from '../../../../models';
import { SEARCH_PATIENT_DOCUMENT } from '../../../../graphql';
import type { SearchPatientQuery } from '../../../../types/generated.types';
import { selectedPatientVar } from '../../../../store';

export default function SearchPatient() {
  const { selectedClinic } = ClinicsOfClient;
  const selectedPatient = useReactiveVar(selectedPatientVar);

  const { register, getValues, handleSubmit } = useForm({
    mode: 'onChange',
  });
  const [queryPageNumber, setQueryPageNumber] = useState(1);

  const [callQuery, { loading, data: searchPatientResult }] =
    useLazyQuery<SearchPatientQuery>(SEARCH_PATIENT_DOCUMENT);

  const onSubmit = () => {
    if (!loading && selectedClinic) {
      const { patientName } = getValues();
      const patientNameTrim = patientName.trim();

      callQuery({
        variables: {
          input: {
            page: queryPageNumber,
            query: patientNameTrim,
            clinicIds: [selectedClinic.id],
          },
        },
      });
    }
  };
  const pageNumbers = (total: number): number[] => {
    const arr = [];
    for (let i = 0; i < total; i += 1) {
      arr.push(i);
      if (i > 100) break;
    }
    return arr;
  };
  const clearSelectedPatient = () => {
    selectedPatientVar(undefined);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <div className="search-input relative flex items-center">
        <input
          {...register('patientName', {
            required: '환자 이름을 입력하세요',
          })}
          id="search-patient__patientName"
          required
          type="text"
          placeholder="이름을 입력하세요"
          className="input"
          autoComplete="off"
          onFocus={clearSelectedPatient}
        />
        <label
          htmlFor="search-patient__icon-search"
          className="absolute right-0 mr-2 cursor-pointer"
        >
          <input
            id="search-patient__icon-search"
            type="submit"
            value=""
            tabIndex={-1}
            className="absolute"
          />
          <FontAwesomeIcon icon={faSearch} fontSize={14} />
        </label>
      </div>
      <div
        className={cls(
          'search-list mt-4 h-36 divide-y overflow-y-scroll border',
          selectedPatient ? 'border-none' : ''
        )}
      >
        {!selectedPatient &&
          searchPatientResult?.searchPatient.patients?.map((patient, index) => (
            <div key={index} className="btn-menu rounded-none">
              <NameTag
                patient={{
                  // 할일: 선택된환자 형태로 가공하는 메서드
                  ...patient,
                  user: patient.users[patient.users.length - 1],
                }}
                canClick
              />
            </div>
          ))}
        {!selectedPatient && !searchPatientResult ? (
          <p className="text-center">
            환자 목록
            <br />
            검색하면 나타납니다
          </p>
        ) : (
          searchPatientResult?.searchPatient.patients?.length === 0 && (
            <Warning type="emptySearch" />
          )
        )}
        {selectedPatient && (
          <div className="mx-auto flex h-5/6 items-center justify-between rounded-md border border-green-500 px-2 shadow-cst">
            <NameTag patient={selectedPatient} />
            <MenuButton onClick={clearSelectedPatient} enabled>
              <FontAwesomeIcon icon={faXmark} fontSize={14} />
            </MenuButton>
          </div>
        )}
      </div>
      <div className="page-list mt-1 h-1 space-x-4 text-center">
        {searchPatientResult &&
          pageNumbers(searchPatientResult.searchPatient.totalPages ?? 0).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                className={cls(
                  'appearance-none px-1 focus:rounded-sm focus:outline-none focus:ring-1 focus:ring-green-500',
                  queryPageNumber === pageNumber + 1
                    ? 'font-bold text-red-500'
                    : ''
                )}
                onClick={() => {
                  clearSelectedPatient();
                  setQueryPageNumber(pageNumber + 1);
                }}
                type="button"
              >
                {pageNumber + 1}
              </button>
            )
          )}
      </div>
    </form>
  );
}
