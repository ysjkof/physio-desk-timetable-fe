import { QueryResult, useQuery } from '@apollo/client';
import { GET_PRESCRIPTIONS_BY_CLINIC_DOCUMENT } from '../graphql';
import { useStore } from '../store';
import type {
  GetPrescriptionsByClinicQuery,
  GetPrescriptionsByClinicQueryVariables,
} from '../types/generatedTypes';
import type { ResultOfFindPrescriptions } from '../types/processedGeneratedTypes';

export const useGetPrescriptions = (): [
  ResultOfFindPrescriptions | null | undefined,
  QueryResult<
    GetPrescriptionsByClinicQuery,
    GetPrescriptionsByClinicQueryVariables
  >
] => {
  const id = useStore((state) => state.pickedClinicId);
  const variables = { input: { id } };

  const results = useQuery<
    GetPrescriptionsByClinicQuery,
    GetPrescriptionsByClinicQueryVariables
  >(GET_PRESCRIPTIONS_BY_CLINIC_DOCUMENT, {
    variables,
    onCompleted(data) {
      const { ok, error } = data.getPrescriptionsByClinic;
      if (!ok) {
        console.error(error);
        return false;
      }
    },
  });

  return [results.data?.getPrescriptionsByClinic, results];
};
