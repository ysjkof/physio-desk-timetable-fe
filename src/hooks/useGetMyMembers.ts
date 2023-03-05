import { QueryResult, useQuery } from '@apollo/client';
import { GET_MY_MEMBERS_DOCUMENT } from '../graphql/clinics';
import type {
  GetMyMembersQuery,
  GetMyMembersQueryVariables,
} from '../types/generatedTypes';
import type { MyMembersType } from '../types/processedGeneratedTypes';

export const useGetMyMembers = (): [
  MyMembersType | undefined,
  QueryResult<GetMyMembersQuery, GetMyMembersQueryVariables>
] => {
  const results = useQuery<GetMyMembersQuery, GetMyMembersQueryVariables>(
    GET_MY_MEMBERS_DOCUMENT
  );

  return [results.data?.getMyMembers.members, results];
};
