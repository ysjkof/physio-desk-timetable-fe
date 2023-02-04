import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { ClinicsOfClient } from '../models';
import { GET_PRESCRIPTIONS_DOCUMENT } from '../graphql/prescriptions/getPrescriptions.gql';
import type {
  GetPrescriptionsQuery,
  GetPrescriptionsQueryVariables,
} from '../types/generated.types';

export const useGetPrescription = () => {
  const clinicId = ClinicsOfClient.getSelectedClinic().id;

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
