import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { clinicListsVar, selectedInfoVar } from '../../store';
import { cls, renameUseSplit } from '../../utils/utils';
import { useWindowSize } from '../../hooks';
import { getYMD } from '../../services/dateServices';
import ListCell from './atoms/ListCell';
import SearchList from './organisms/SearchList';
import Button from '../../_legacy_components/molecules/Button';
import Warning from '../../_legacy_components/atoms/Warning';
import Checkbox from '../../_legacy_components/molecules/Checkbox';
import { GENDER_KOR, MUOOL } from '../../constants/constants';
import { SEARCH_PATIENT_DOCUMENT } from '../../graphql';
import type { SearchPatientQuery } from '../../types/generated.types';
import { ClinicsOfClient } from '../../models';

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedClinic } = ClinicsOfClient;

  const [page, setPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([1]);
  const selectedInfo = useReactiveVar(selectedInfoVar);
  const clinicLists = useReactiveVar(clinicListsVar);
  const { register, getValues } = useForm<{ clinicIds: number[] }>({
    defaultValues: { clinicIds: [selectedClinic.id] },
  });

  const [callQuery, { loading, data }] = useLazyQuery<SearchPatientQuery>(
    SEARCH_PATIENT_DOCUMENT
  );

  const changePage = (pageNumber: number) => {
    if (page === pageNumber) return;
    setPage(pageNumber);
  };

  const invokeQuery = () => {
    const { search } = location;
    const [_, queryName] = search.split('?name=');
    if (!queryName) {
      return navigate(-1);
    }
    const { clinicIds } = getValues();
    callQuery({
      variables: {
        input: {
          page,
          query: decodeURI(queryName),
          clinicIds: clinicIds.map((id) => +id),
        },
      },
      onCompleted(data) {
        if (data.searchPatient.totalPages) {
          const totalPageCount = Math.ceil(data.searchPatient.totalPages / 20);
          const numbers = [1];
          while (numbers.length < totalPageCount) {
            numbers.push(numbers.length + 1);
          }

          setPageNumbers(numbers);
        }
      },
    });
  };
  useEffect(() => {
    invokeQuery();
  }, [location, page]);

  const { height } = useWindowSize(true);

  return (
    <>
      <Helmet>
        <title>검색 | {MUOOL}</title>
      </Helmet>
      <div
        className="mx-auto overflow-y-scroll border-t bg-white pb-16"
        style={{ height }}
      >
        <div id="search__header" className="shadow-sm">
          <div className="flex justify-between border-b px-6 py-2">
            <h1 className="text-base font-bold">환자 검색</h1>
            <Button canClick isSmall onClick={invokeQuery} loading={loading}>
              검색
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 border-b px-6 py-2">
            {clinicLists.map((clinic) => (
              <Checkbox
                key={clinic.id}
                id={'search__clinic-' + clinic.id}
                label={renameUseSplit(clinic.name)}
                type="checkbox"
                value={clinic.id}
                register={register('clinicIds', {
                  required: true,
                })}
                defaultChecked={clinic.id === selectedClinic.id}
              />
            ))}
          </div>
          <div className="grid grid-cols-[1fr,4rem,1fr,3rem,5rem,5rem] divide-x border-b-2 sm:px-6 lg:grid-cols-6">
            {['병원', '등록번호', '이름', '성별', '생년월일', '기능'].map(
              (title) => (
                <ListCell key={title} className="">
                  {title}
                </ListCell>
              )
            )}
          </div>
        </div>
        <div id="search__results" className="divide-y">
          {!data ||
          !data.searchPatient.patients ||
          data.searchPatient.patients.length === 0 ? (
            <Warning type="emptySearch" />
          ) : (
            data.searchPatient.patients.map((patient, idx) => (
              <SearchList
                key={idx}
                id={patient.id}
                clinicName={renameUseSplit(patient.clinic?.name || 'error')}
                registrationNumber={patient.registrationNumber}
                name={patient.name}
                gender={GENDER_KOR[patient.gender as keyof typeof GENDER_KOR]}
                birthday={getYMD(patient.birthday, 'yyyymmdd', '-')}
              />
            ))
          )}
        </div>
        <div
          id="search__footer"
          className="absolute bottom-0 flex h-16 w-full items-center justify-center gap-2 border-t-2 bg-white text-sm"
        >
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={cls(
                'border px-2',
                page === pageNumber ? 'text-base font-semibold' : ''
              )}
              onClick={() => changePage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
