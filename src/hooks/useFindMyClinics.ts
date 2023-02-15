import { QueryResult, useQuery } from '@apollo/client';
import { FIND_MY_CLINICS_DOCUMENT } from '../graphql';
import type {
  FindMyClinicsQuery,
  FindMyClinicsQueryVariables,
} from '../types/generatedTypes';
import type { ClinicsOfFindMyClinics } from '../types/processedGeneratedTypes';

interface UseFindMyClinicsProps {
  hasInactivate?: boolean;
}

// TODO: hasInactivate는 findMyMembers와 findMyClinics가 동일해야 한다.
// SettingOfTimetable과 ClinicSelector의 탈퇴 병원 표시 방법 정한 뒤 적용할 것.
export const useFindMyClinics = ({
  hasInactivate = true,
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
