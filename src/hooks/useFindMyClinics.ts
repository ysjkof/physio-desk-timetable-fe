import { QueryResult, useQuery } from '@apollo/client';
import { FIND_MY_CLINICS_DOCUMENT } from '../graphql';
import type {
  FindMyClinicsQuery,
  FindMyClinicsQueryVariables,
} from '../types/generated.types';
import type { ClinicsOfFindMyClinics } from '../types/common.types';

interface UseFindMyClinicsProps {
  hasInactivate?: boolean;
}

export const useFindMyClinics = ({
  hasInactivate = false,
}: UseFindMyClinicsProps): [
  ClinicsOfFindMyClinics,
  QueryResult<FindMyClinicsQuery, FindMyClinicsQueryVariables>
] => {
  // 비활성은 평소 볼 일이 많지 않기 때문에 필요시에 더 요청해서 보기
  const variables = { input: { includeInactivate: hasInactivate } };
  const results = useQuery<FindMyClinicsQuery, FindMyClinicsQueryVariables>(
    FIND_MY_CLINICS_DOCUMENT,
    { variables }
  );

  return [results.data?.findMyClinics.clinics, results];
};
