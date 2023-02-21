import { useLazyQuery } from '@apollo/client';
import { useState } from 'react';
import { SEARCH_PATIENT_DOCUMENT } from '../graphql';
import { SearchPatientQuery } from '../types/generatedTypes';
import { useStore } from '../store';

export const useLazySearchPatient = () => {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([1]);

  const [callQuery, queryResult] = useLazyQuery<SearchPatientQuery>(
    SEARCH_PATIENT_DOCUMENT
  );

  const clinicId = useStore((state) => state.pickedClinicId);

  const patientQuery = (name: string) => {
    const query = name.trim();
    if (queryResult.loading || !query) return;
    callQuery({
      variables: {
        input: {
          page,
          query,
          clinicIds: [clinicId],
        },
      },
      onCompleted(data) {
        const { totalPages } = data.searchPatient;
        if (!totalPages) return;

        setPages(getPages(totalPages));
      },
      fetchPolicy: 'network-only',
    });
  };

  const getPages = (total: number): number[] => {
    const pagesArray = [];
    const LOOP_LIMIT = 1000;
    for (let i = 0; i < total; i += 1) {
      pagesArray.push(i + 1);
      if (i > LOOP_LIMIT) break;
    }
    return pagesArray;
  };

  const changePage = (pageNumber: number) => {
    setPage(pageNumber);
  };

  return { ...queryResult, patientQuery, pages, page, changePage };
};
