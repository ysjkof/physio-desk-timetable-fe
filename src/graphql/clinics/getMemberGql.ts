import { gql } from '@apollo/client';
import { USER_ID_NAME_EMAIL_FIELDS } from '../users/_usersFragmentsGql';
import { COMMON_MEMBER_FIELDS } from './_clinicsFragmentsGql';

export const GET_MEMBER_DOCUMENT = gql`
  ${COMMON_MEMBER_FIELDS}
  ${USER_ID_NAME_EMAIL_FIELDS}
  query getMember($input: GetMemberInput!) {
    getMember(input: $input) {
      ok
      error
      member {
        ...CommonMemberFields
        color {
          value
        }
        user {
          ...UserIdNameEmailFields
          role
        }
      }
      countOfPatient
    }
  }
`;
