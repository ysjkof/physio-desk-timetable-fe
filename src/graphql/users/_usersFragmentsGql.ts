import { gql } from '@apollo/client';

export const USER_EMAIL_AND_VERIFY_FIELDS = gql`
  fragment UserEmailAndVerifyFields on User {
    email
    verified
  }
`;

export const USER_ID_NAME_NICKNAME_EMAIL_FIELDS = gql`
  fragment UserIdNameNicknameEmailFields on User {
    id
    name
    nickname
    email
  }
`;
