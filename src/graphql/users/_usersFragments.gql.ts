import { gql } from '@apollo/client';

export const USER_EMAIL_AND_VERIFY_FIELDS = gql`
  fragment UserEmailAndVerifyFields on User {
    email
    verified
  }
`;

export const USER_ID_NAME_EMAIL_FIELDS = gql`
  fragment UserIdNameEmailFields on User {
    id
    name
    email
  }
`;
