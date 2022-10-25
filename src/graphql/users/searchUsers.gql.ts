import { gql } from '@apollo/client';
import { USER_ID_NAME_EMAIL_FIELDS } from './_usersFragments.gql';

export const SEARCH_USERS_DOCUMENT = gql`
  ${USER_ID_NAME_EMAIL_FIELDS}
  query searchUsers($input: SearchUsersInput!) {
    searchUsers(input: $input) {
      ok
      error
      totalCount
      results {
        ...UserIdNameEmailFields
      }
    }
  }
`;
