import { gql } from '@apollo/client';

export const SEND_CHANGE_EMAIL_DOCUMENT = gql`
  mutation sendChangeEmail($input: SendChangeEmailInput!) {
    sendChangeEmail(input: $input) {
      ok
      error
    }
  }
`;
