import { QueryResult, useQuery } from '@apollo/client';
import { GET_MY_CLINICS_DOCUMENT } from '../graphql';
import type {
  GetMyClinicsQuery,
  GetMyClinicsQueryVariables,
} from '../types/generatedTypes';
import type { ClinicsOfGetMyClinics } from '../types/processedGeneratedTypes';

interface UseFindMyClinicsProps {
  hasInactivate?: boolean;
}

// TODO: hasInactivate는 getMyMembers와 getMyClinics가 동일해야 한다.
export const useGetMyClinics = ({
  hasInactivate = true,
}: UseFindMyClinicsProps): [
  ClinicsOfGetMyClinics,
  QueryResult<GetMyClinicsQuery, GetMyClinicsQueryVariables>
] => {
  // 비활성은 평소 볼 일이 많지 않기 때문에 필요시에 더 요청해서 보기
  const variables = { input: { includeInactivate: hasInactivate } };
  const results = useQuery<GetMyClinicsQuery, GetMyClinicsQueryVariables>(
    GET_MY_CLINICS_DOCUMENT,
    { variables }
  );

  return [results.data?.getMyClinics.clinics, results];
};
