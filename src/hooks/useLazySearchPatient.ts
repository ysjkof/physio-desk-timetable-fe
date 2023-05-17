import { useLazyQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_PATIENT_BY_DOCUMENT } from '../graphql';
import { useStore } from '../store';
import { getDateFromStr8Digit } from '../utils/dateUtils';
import type {
  GetPatientByInput,
  GetPatientByQuery,
  GetPatientByQueryVariables,
} from '../types/generatedTypes';

interface PatientQueryInput extends Pick<GetPatientByInput, 'query'> {
  clinicIds?: number[];
}

export const useLazySearchPatient = () => {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([1]);

  const [callQuery, queryResult] = useLazyQuery<
    GetPatientByQuery,
    GetPatientByQueryVariables
  >(GET_PATIENT_BY_DOCUMENT);

  const clinicId = useStore((state) => state.pickedClinicId);

  const patientQuery = ({ query, clinicIds }: PatientQueryInput) => {
    if (queryResult.loading || !query) return;

    let _query: string | Date = query.trim();
    if (parseInt(_query, 10)) {
      if (query.length === 8) _query = getDateFromStr8Digit(query);
      else return;
    }

    callQuery({
      variables: {
        input: {
          page: 1,
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
    setPage(1);
  };

  const getPages = (totalPages: number): number[] => {
    const pagesArray = [];
    const LOOP_LIMIT = 10000;
    for (let i = 0; i < totalPages; i += 1) {
      pagesArray.push(i + 1);
      if (i > LOOP_LIMIT) break;
    }
    return pagesArray;
  };

  return { ...queryResult, patientQuery, pages, page, setPage };
};
