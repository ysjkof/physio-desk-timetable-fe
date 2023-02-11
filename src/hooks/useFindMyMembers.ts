import { useQuery } from '@apollo/client';
import { FIND_MY_MEMBERS_DOCUMENT } from '../graphql/clinics';
import {
  FindMyMembersQuery,
  FindMyMembersQueryVariables,
} from '../types/generated.types';

export const useFindMyMembers = () => {
  const results = useQuery<FindMyMembersQuery, FindMyMembersQueryVariables>(
    FIND_MY_MEMBERS_DOCUMENT
  );

  return results;
};
