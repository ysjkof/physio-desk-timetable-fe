import { FormEvent, useEffect } from 'react';
import {
  useDebouncedCallback,
  useLazySearchPatient,
} from '../../../../../../hooks';

export const useRecipientSearchForm = () => {
  const {
    data,
    loading,
    variables,
    page,
    setPage,
    patientQuery,
    fetchMore: _fetchMore,
  } = useLazySearchPatient();

  const debounceQuery = useDebouncedCallback(patientQuery);

  const handleInputOnChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    debounceQuery({ query: value });
  };

  const fetchMore = () => {
    if (loading || !data?.getPatientBy.hasMore) return;
    let newPage = page + 1;

    _fetchMore({
      variables: { input: { ...variables?.input, page: newPage } },
      updateQuery: (prevResults, { fetchMoreResult, variables }) => {
        if (!fetchMoreResult.getPatientBy.patients) return prevResults;
        const prevMessage = prevResults.getPatientBy.patients || [];
        const newMessage = fetchMoreResult.getPatientBy.patients || [];
        const newResult = structuredClone(fetchMoreResult);
        newResult.getPatientBy.patients = [...prevMessage, ...newMessage];
        return newResult;
      },
    });
    setPage(newPage);
  };

  const hasMorePages = !!data?.getPatientBy.hasMore;
  const patients = data?.getPatientBy.patients;
  useEffect(() => {
    if (!variables?.input) return;
    patientQuery({ query: variables.input.query });
  }, []);

  return { patients, handleInputOnChange, hasMorePages, fetchMore };
};
