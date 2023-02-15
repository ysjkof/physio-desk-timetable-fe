import { gql } from '@apollo/client';

export const VERIFY_EMAIL_DOCUMENT = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;
