import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PRESCRIPTION_BY_ID_DOCUMENT } from '../graphql';
import type {
  GetPrescriptionByIdQuery,
  GetPrescriptionByIdQueryVariables,
} from '../types/generatedTypes';

export const useGetPrescriptionById = () => {
  const { prescriptionId } = useParams();

  if (!prescriptionId) throw new Error();

  return useQuery<GetPrescriptionByIdQuery, GetPrescriptionByIdQueryVariables>(
    GET_PRESCRIPTION_BY_ID_DOCUMENT,
    { variables: { input: { id: +prescriptionId } } }
  );
};
