import { QueryResult, useQuery } from '@apollo/client';
import { GET_CLINIC_DOCUMENT } from '../graphql';
import { useStore } from '../store';
import type {
  GetClinicQuery,
  GetClinicQueryVariables,
} from '../types/generatedTypes';
import type { ClinicOfGetMyClinic } from '../types/commonTypes';

export const useGetClinic = (): [
  ClinicOfGetMyClinic,
  QueryResult<GetClinicQuery, GetClinicQueryVariables>
] => {
  const clinicId = useStore((state) => state.pickedClinicId);

  const results = useQuery<GetClinicQuery, GetClinicQueryVariables>(
    GET_CLINIC_DOCUMENT,
    { variables: { input: { clinicId } } }
  );

  return [results.data?.getClinic.clinic, results];
};
