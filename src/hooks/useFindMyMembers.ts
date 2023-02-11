import { QueryResult, useQuery } from '@apollo/client';
import { FIND_MY_MEMBERS_DOCUMENT } from '../graphql/clinics';
import {
  FindMyMembersQuery,
  FindMyMembersQueryVariables,
} from '../types/generated.types';

export const useFindMyMembers = (): [
  FindMyMembersQuery['findMyMembers']['members'] | undefined,
  QueryResult<FindMyMembersQuery, FindMyMembersQueryVariables>
] => {
  const results = useQuery<FindMyMembersQuery, FindMyMembersQueryVariables>(
    FIND_MY_MEMBERS_DOCUMENT
  );

  return [results.data?.findMyMembers.members, results];
};
