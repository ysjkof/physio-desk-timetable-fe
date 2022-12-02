import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import {
  createArrayFromLength,
  renameUseSplit,
} from '../../utils/common.utils';
import { useWindowSize } from '../../hooks';
import { getYMD } from '../../utils/date.utils';
import { ButtonOfPages } from '../../components';
import {
  SearchCheckList,
  SearchList,
  SearchNavigation,
  SearchTitle,
} from './components';
import Warning from '../../_legacy_components/atoms/Warning';
import { GENDER_KOR, MUOOL } from '../../constants/constants';
import { SEARCH_PATIENT_DOCUMENT } from '../../graphql';
import { ClinicsOfClient } from '../../models';
import type { SearchPatientQuery } from '../../types/generated.types';

export default function Search() {
  const { selectedClinic } = ClinicsOfClient;
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const [callQuery, { loading, data }] = useLazyQuery<SearchPatientQuery>(
    SEARCH_PATIENT_DOCUMENT
  );

  const { register, getValues } = useForm<{ clinicIds: number[] }>({
    defaultValues: { clinicIds: [selectedClinic.id] },
  });

  const { height } = useWindowSize(true);

  const invokeQuery = () => {
    const queryName = location.search.split('?name=')[1];
    if (!queryName) return navigate(-1);

    const { clinicIds } = getValues();
    callQuery({
      variables: {
        input: {
          page,
          query: decodeURI(queryName),
          clinicIds: clinicIds.map((id) => +id),
        },
      },
    });
  };

  const numberOfPages = createArrayFromLength(
    data?.searchPatient.totalPages || 1
  );

  const changePage = (pageNumber: number) => {
    if (page === pageNumber) return;
    setPage(pageNumber);
  };

  useEffect(() => {
    invokeQuery();
  }, [location, page]);

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
          <SearchNavigation invokeQuery={invokeQuery} loading={loading} />
          <SearchCheckList
            register={register}
            selectedClinicId={selectedClinic.id}
          />
          <SearchTitle
            subject={['병원', '등록번호', '이름', '성별', '생년월일', '기능']}
          />
        </div>
        <div id="search__results" className="divide-y">
          {!data?.searchPatient.patients ||
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
          {numberOfPages.map((pageNumber) => (
            <ButtonOfPages
              key={pageNumber}
              page={pageNumber}
              isActive={pageNumber === page}
              changePage={changePage}
              hasBorder
            />
          ))}
        </div>
      </div>
    </>
  );
}
