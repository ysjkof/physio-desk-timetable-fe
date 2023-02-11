import { QueryResult, useQuery } from '@apollo/client';
import { FIND_MY_CLINICS_DOCUMENT } from '../graphql';
import type {
  FindMyClinicsQuery,
  FindMyClinicsQueryVariables,
} from '../types/generated.types';

export const useFindMyClinics = (): [
  FindMyClinicsQuery['findMyClinics']['clinics'],
  QueryResult<FindMyClinicsQuery, FindMyClinicsQueryVariables>
] => {
  const variables = { input: { includeInactivate: true } };
  const results = useQuery<FindMyClinicsQuery, FindMyClinicsQueryVariables>(
    FIND_MY_CLINICS_DOCUMENT,
    { variables }
  );
  return [results.data?.findMyClinics.clinics, results];
};
