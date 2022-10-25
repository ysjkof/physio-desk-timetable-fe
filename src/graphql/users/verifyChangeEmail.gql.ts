import { gql } from '@apollo/client';

export const VERIFY_CHANGE_EMAIL_DOCUMENT = gql`
  mutation verifyChangeEmail($input: VerifyChangeEmailInput!) {
    verifyChangeEmail(input: $input) {
      ok
      error
    }
  }
`;
