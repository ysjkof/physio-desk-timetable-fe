import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PRESCRIPTIONS_DOCUMENT } from '../graphql/prescriptions/getPrescriptions.gql';
import type {
  GetPrescriptionsQuery,
  GetPrescriptionsQueryVariables,
} from '../types/generated.types';
import { useStore } from '../store';

export const useGetPrescription = () => {
  const clinicId = useStore((state) => state.selectedClinicId);

  const { prescriptionId } = useParams();

  if (!prescriptionId) throw new Error();

  return useQuery<GetPrescriptionsQuery, GetPrescriptionsQueryVariables>(
    GET_PRESCRIPTIONS_DOCUMENT,
    {
      variables: {
        input: {
          clinicId,
          prescriptionIds: [+prescriptionId],
          onlyLookUpActive: false,
        },
      },
    }
  );
};
