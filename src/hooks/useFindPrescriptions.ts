import { QueryResult, useQuery } from '@apollo/client';
import { FIND_PRESCRIPTIONS_DOCUMENT } from '../graphql';
import { useStore } from '../store';
import type {
  FindPrescriptionsQuery,
  FindPrescriptionsQueryVariables,
} from '../types/generatedTypes';
import type { ResultOfFindPrescriptions } from '../types/processedGeneratedTypes';

export const useFindPrescriptions = (): [
  ResultOfFindPrescriptions | null | undefined,
  QueryResult<FindPrescriptionsQuery, FindPrescriptionsQueryVariables>
] => {
  const clinicId = useStore((state) => state.pickedClinicId);

  const variables = { input: { clinicId, onlyLookUpActive: false } };

  const results = useQuery<
    FindPrescriptionsQuery,
    FindPrescriptionsQueryVariables
  >(FIND_PRESCRIPTIONS_DOCUMENT, {
    variables,
    onCompleted(data) {
      const { ok, error } = data.findPrescriptions;
      if (!ok) {
        console.error(error);
        return false;
      }
    },
  });

  return [results.data?.findPrescriptions, results];
};
