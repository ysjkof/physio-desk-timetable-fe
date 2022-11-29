import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLazyQuery } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useStore } from '../../../../hooks';
import NameTag from './NameTag';
import Warning from '../../../../_legacy_components/atoms/Warning';
import MenuButton from '../../../../_legacy_components/molecules/MenuButton';
import { cls, renameUseSplit } from '../../../../utils/utils';
import { ClinicsOfClient } from '../../../../models';
import { SEARCH_PATIENT_DOCUMENT } from '../../../../graphql';
import type { SearchPatientQuery } from '../../../../types/generated.types';

export default function SearchPatient() {
  const { selectedClinic } = ClinicsOfClient;

  const { selectedInfo, setSelectedInfo } = useStore();

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
    let arr = [];
    for (let i = 0; i < total; i++) {
      arr.push(i);
      if (i > 100) break;
    }
    return arr;
  };
  const removeSelectedPatient = () => {
    setSelectedInfo('patient', null);
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
          onFocus={removeSelectedPatient}
          autoFocus
        />
        <label
          htmlFor="search-patient__icon-search"
          className="absolute right-0 mr-2 cursor-pointer"
        >
          <input
            id="search-patient__icon-search"
            type="submit"
            value={''}
            tabIndex={-1}
            className="absolute"
          />
          <FontAwesomeIcon icon={faSearch} fontSize={14} />
        </label>
      </div>
      <div
        className={cls(
          'search-list mt-4 h-36 divide-y overflow-y-scroll border',
          selectedInfo.patient ? 'border-none' : ''
        )}
      >
        {!selectedInfo.patient &&
          searchPatientResult?.searchPatient.patients?.map((patient, index) => (
            <div key={index} className="btn-menu rounded-none">
              <NameTag
                id={patient.id}
                gender={patient.gender}
                name={patient.name}
                registrationNumber={patient.registrationNumber}
                birthday={patient.birthday}
                canClick
                clinicName={renameUseSplit(patient.clinic?.name || '')}
                user={patient.users[patient.users.length - 1]}
              />
            </div>
          ))}
        {!selectedInfo.patient && !searchPatientResult ? (
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
        {selectedInfo.patient && (
          <div className="mx-auto flex h-5/6 items-center justify-between rounded-md border border-green-500 px-2 shadow-cst">
            <NameTag
              id={selectedInfo.patient.id}
              gender={selectedInfo.patient.gender}
              name={selectedInfo.patient.name}
              registrationNumber={selectedInfo.patient.registrationNumber}
              birthday={selectedInfo.patient.birthday}
              clinicName={selectedInfo.patient.clinicName}
              user={selectedInfo.patient.user}
            />
            <MenuButton onClick={removeSelectedPatient} enabled>
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
                  removeSelectedPatient();
                  setQueryPageNumber(pageNumber + 1);
                }}
              >
                {pageNumber + 1}
              </button>
            )
          )}
      </div>
    </form>
  );
}
