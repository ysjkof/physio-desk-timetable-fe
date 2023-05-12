import { ChangeEvent, useEffect, useState } from 'react';
import {
  useDebouncedCallback,
  useLazySearchPatient,
} from '../../../../../hooks';
import type { PatientsInSearch } from '../../../../../types/processedGeneratedTypes';

export const usePatientSelector = () => {
  const { patientQuery, data, loading, variables } = useLazySearchPatient();

  const [page, setPage] = useState(1);
  const [patients, setPatients] = useState<PatientsInSearch>();

  const hasMorePages = (data?.getPatientBy.totalPages || 0) > page;

  const debounceQuery = useDebouncedCallback(patientQuery);

  const handleInputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (!value) return setPatients(null);

    debounceQuery({ query: value, page });
  };

  const plusPage = () => setPage(page + 1);

  useEffect(() => {
    if (loading) return;
    if (!data?.getPatientBy.patients || data?.getPatientBy.patients.length < 1)
      return setPatients(null);

    setPatients((prev) => {
      if (!prev) return data.getPatientBy.patients;
      if (data.getPatientBy.patients)
        return [...prev, ...data.getPatientBy.patients];
    });
  }, [data?.getPatientBy.patients]);

  useEffect(() => {
    if (!variables?.input) return;
    patientQuery({ page, query: variables.input.query });
  }, [page]);

  return { patients, handleInputOnChange, hasMorePages, plusPage };
};
