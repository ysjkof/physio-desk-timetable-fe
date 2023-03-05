import { useLazyQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_PATIENT_BY_DOCUMENT } from '../graphql';
import { GetPatientByQuery } from '../types/generatedTypes';
import { useStore } from '../store';
import { getDateFromStr8Digit } from '../utils/dateUtils';

export const useLazySearchPatient = () => {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([1]);

  const [callQuery, queryResult] = useLazyQuery<GetPatientByQuery>(
    GET_PATIENT_BY_DOCUMENT
  );

  const clinicId = useStore((state) => state.pickedClinicId);

  const patientQuery = (name: string, clinicIds?: number[]) => {
    if (queryResult.loading || !name) return;

    let query: string | Date = name.trim();

    if (parseInt(query, 10)) {
      if (query.length === 8) query = getDateFromStr8Digit(name);
      else return;
    }

    callQuery({
      variables: {
        input: {
          page,
          query,
          clinicIds: clinicIds || [clinicId],
        },
      },
      onCompleted(data) {
        const { totalPages } = data.getPatientBy;
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
