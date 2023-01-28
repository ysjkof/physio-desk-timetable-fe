import { useLazyQuery } from '@apollo/client';
import { useState } from 'react';
import { SEARCH_PATIENT_DOCUMENT } from '../graphql';
import { ClinicsOfClient } from '../models';
import { SearchPatientQuery } from '../types/generated.types';

export const useSearchPatient = () => {
  const selectedClinic = ClinicsOfClient.getSelectedClinic();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([1]);

  const [callQuery, queryResult] = useLazyQuery<SearchPatientQuery>(
    SEARCH_PATIENT_DOCUMENT
  );

  const patientQuery = (name: string) => {
    const query = name.trim();
    if (queryResult.loading || !query) return;
    callQuery({
      variables: {
        input: {
          page,
          query,
          clinicIds: [selectedClinic.id],
        },
      },

      onCompleted(data) {
        const { totalPages } = data.searchPatient;
        if (!totalPages) return;
        setPages(getPages(totalPages));
      },
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
