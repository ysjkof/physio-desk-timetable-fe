import { gql } from '@apollo/client';
import { USER_ID_NAME_NICKNAME_EMAIL_FIELDS } from './_usersFragmentsGql';

export const GET_USERS_BY_NAME_DOCUMENT = gql`
  ${USER_ID_NAME_NICKNAME_EMAIL_FIELDS}
  query getUsersByName($input: GetUsersByNameInput!) {
    getUsersByName(input: $input) {
      ok
      error
      totalCount
      results {
        ...UserIdNameNicknameEmailFields
      }
    }
  }
`;
