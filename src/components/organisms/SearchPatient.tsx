import { useReactiveVar } from '@apollo/client';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchPatientLazyQuery } from '../../graphql/generated/graphql';
import { selectedClinicVar, selectedPatientVar } from '../../store';
import { MenuButton } from '../molecules/MenuButton';
import { NameTag } from '../NameTag';
interface SearchPatientProps {}

export const SearchPatient = ({}: SearchPatientProps) => {
  const { register, getValues, handleSubmit } = useForm({
    mode: 'onChange',
  });
  const [queryPageNumber, setQueryPageNumber] = useState(1);
  const selectedPatient = useReactiveVar(selectedPatientVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);

  const [callQuery, { loading, data: searchPatientResult }] =
    useSearchPatientLazyQuery();
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
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <div className="search-input relative flex items-center">
        <input
          {...register('patientName', {
            required: '환자 이름을 입력하세요',
          })}
          id="patientName"
          required
          type="text"
          placeholder="이름을 입력하세요"
          className="input"
          autoComplete="off"
          onFocus={() => selectedPatientVar(null)}
          autoFocus
        />
        <label
          htmlFor="icon-search"
          className="absolute right-0 mr-2 cursor-pointer"
        >
          <input
            id="icon-search"
            type="submit"
            value={''}
            tabIndex={-1}
            className="absolute"
          />
          <FontAwesomeIcon icon={faSearch} fontSize={14} />
        </label>
      </div>
      <div
        className={`search-list mt-4 h-36 divide-y overflow-y-scroll border ${
          selectedPatient ? 'border-none' : ''
        }`}
      >
        {!selectedPatient &&
          searchPatientResult?.searchPatient.patients?.map((patient, index) => (
            <div key={index} className="btn-menu rounded-none">
              <NameTag
                id={patient.id}
                gender={patient.gender}
                name={patient.name}
                registrationNumber={patient.registrationNumber}
                birthday={patient.birthday}
                canClick
                clinicName={patient.clinic?.name ?? ''}
                user={patient.users[patient.users.length - 1]}
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
            <p className="text-center ">검색결과가 없습니다.</p>
          )
        )}
        {selectedPatient && (
          <div className="mx-auto flex h-5/6 items-center justify-between rounded-md border border-green-500 px-2 shadow-cst">
            <NameTag
              id={selectedPatient.id}
              gender={selectedPatient.gender}
              name={selectedPatient.name}
              registrationNumber={selectedPatient.registrationNumber}
              birthday={selectedPatient.birthday}
              clinicName={selectedPatient.clinicName}
              user={selectedPatient.user}
            />
            <MenuButton
              onClick={() => selectedPatientVar(null)}
              enabled
              icon={<FontAwesomeIcon icon={faXmark} fontSize={14} />}
            />
          </div>
        )}
      </div>
      <div className="page-list mt-1 h-1 space-x-4 text-center">
        {searchPatientResult
          ? pageNumbers(searchPatientResult.searchPatient.totalPages ?? 0).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  className={`appearance-none px-1 focus:rounded-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${
                    queryPageNumber === pageNumber + 1
                      ? 'font-bold text-red-500'
                      : ''
                  }`}
                  onClick={() => {
                    selectedPatientVar(null);
                    setQueryPageNumber(pageNumber + 1);
                  }}
                >
                  {pageNumber + 1}
                </button>
              )
            )
          : ''}
      </div>
    </form>
  );
};
