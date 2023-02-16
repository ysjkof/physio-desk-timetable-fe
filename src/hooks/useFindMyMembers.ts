import { QueryResult, useQuery } from '@apollo/client';
import { FIND_MY_MEMBERS_DOCUMENT } from '../graphql/clinics';
import type {
  FindMyMembersQuery,
  FindMyMembersQueryVariables,
} from '../types/generatedTypes';
import type { MyMembersType } from '../types/processedGeneratedTypes';

export const useFindMyMembers = (): [
  MyMembersType | undefined,
  QueryResult<FindMyMembersQuery, FindMyMembersQueryVariables>
] => {
  const results = useQuery<FindMyMembersQuery, FindMyMembersQueryVariables>(
    FIND_MY_MEMBERS_DOCUMENT
  );

  return [results.data?.findMyMembers.members, results];
};
