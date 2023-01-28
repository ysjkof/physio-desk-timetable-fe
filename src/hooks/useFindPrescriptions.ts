import { useQuery } from '@apollo/client';
import { FIND_PRESCRIPTIONS_DOCUMENT } from '../graphql';
import { ClinicsOfClient } from '../models';
import type {
  FindPrescriptionsQuery,
  FindPrescriptionsQueryVariables,
} from '../types/generated.types';

export const useFindPrescriptions = () => {
  const { selectedClinic } = ClinicsOfClient;

  const queryResult = useQuery<
    FindPrescriptionsQuery,
    FindPrescriptionsQueryVariables
  >(FIND_PRESCRIPTIONS_DOCUMENT, {
    variables: {
      input: { clinicId: selectedClinic.id, onlyLookUpActive: true },
    },
    onCompleted(data) {
      const { ok, error } = data.findPrescriptions;
      if (!ok) {
        console.error(error);
        return false;
      }
    },
  });

  return queryResult;
};
